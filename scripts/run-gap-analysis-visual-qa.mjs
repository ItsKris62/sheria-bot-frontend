import { createRequire } from "node:module"
import { execFileSync } from "node:child_process"
import { mkdir, mkdtemp, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"
import puppeteer from "puppeteer-core"

const require = createRequire(import.meta.url)
const root = path.resolve(import.meta.dirname, "..")
const output = path.join(root, "test-results", "gap-analysis-visual")
const vitestPackage = require.resolve("vitest/package.json")
const viteEntry = require.resolve("vite", { paths: [vitestPackage] })
const { createServer } = await import(pathToFileURL(viteEntry).href)

await mkdir(output, { recursive: true })
const uploadPath = path.join(output, "enterprise-policy-with-an-extremely-long-filename-that-must-truncate-without-overflow.pdf")
await writeFile(uploadPath, "%PDF-1.4\nvisual qa fixture\n")
const tailwindCli = require.resolve("tailwindcss/lib/cli.js")
const tailwindOutput = path.join(output, "tailwind.css")
const classSources = [
  path.join(root, "app", "globals.css"),
  path.join(root, "app", "(dashboard)", "startup", "gap-analysis", "page.tsx"),
  path.join(root, "tailwind.config.ts"),
  path.join(root, "visual-qa", "main.tsx"),
]
const outputModified = await stat(tailwindOutput).then((value) => value.mtimeMs).catch(() => 0)
const sourceModified = Math.max(...await Promise.all(classSources.map((file) => stat(file).then((value) => value.mtimeMs))))
if (outputModified < sourceModified) {
  execFileSync(process.execPath, [
    tailwindCli,
    "-c", path.join(root, "tailwind.config.ts"),
    "-i", path.join(root, "app", "globals.css"),
    "-o", tailwindOutput,
    "--content", [
      path.join(root, "app", "(dashboard)", "startup", "gap-analysis", "page.tsx"),
      path.join(root, "components", "ui", "**", "*.tsx"),
      path.join(root, "visual-qa", "main.tsx"),
    ].join(","),
    "--minify",
  ], { cwd: root, stdio: "inherit", timeout: 120_000 })
}

const server = await createServer({
  configFile: path.join(root, "visual-qa", "vite.config.ts"),
  logLevel: "warn",
})
await server.listen()
const address = server.httpServer.address()
if (!address || typeof address === "string") throw new Error("Visual QA server did not bind to a TCP port")

const browserExecutable = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
const chromeProfile = await mkdtemp(path.join(output, "chrome-profile-"))
const browser = await puppeteer.launch({
  executablePath: browserExecutable,
  headless: true,
  timeout: 120_000,
  userDataDir: chromeProfile,
  args: ["--no-sandbox", "--disable-gpu"],
})
const allViewports = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 900 },
  { name: "1440", width: 1440, height: 1000 },
]
const allFixtures = ["form", "form-selected", "form-delete", "upload-long", "progress-queued", "progress-running", "progress-retrying", "progress-cancelled", "progress-failed", "history", "results", "results-gaps"]
const requestedViewports = process.env.QA_VIEWPORTS?.split(",").filter(Boolean)
const requestedFixtures = process.env.QA_FIXTURES?.split(",").filter(Boolean)
const viewports = requestedViewports?.length ? allViewports.filter((item) => requestedViewports.includes(item.name)) : allViewports
const fixtures = requestedFixtures?.length ? allFixtures.filter((item) => requestedFixtures.includes(item)) : allFixtures
const findings = []

try {
  for (const viewport of viewports) {
    for (const fixture of fixtures) {
      const page = await browser.newPage()
      console.log(`visual-qa:start:${viewport.name}:${fixture}`)
      await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 })
      await page.goto(`http://127.0.0.1:${address.port}/?fixture=${fixture}`, { waitUntil: "domcontentloaded", timeout: 60_000 })
      await page.waitForSelector("#root > *", { timeout: 60_000 })

      if (fixture === "form" || fixture === "form-selected") {
        const input = await page.$('input[type="file"]')
        if (input) await input.uploadFile(uploadPath)
      }
      if (fixture === "form-selected") {
        await page.select("#jurisdiction-select", "RW")
        await page.type("#framework-search", "Kenya Data")
        const framework = await page.$('button[aria-pressed="false"]')
        if (framework) await framework.click()
        const consent = await page.$('input[type="checkbox"]')
        if (consent) await consent.click()
      }
      if (fixture === "form-delete") {
        const deleteButton = await page.$('button[aria-label^="Delete "]')
        if (deleteButton) await deleteButton.click()
        await page.waitForSelector('[role="alertdialog"]')
      }
      if (fixture === "results-gaps") {
        const tabs = await page.$$("button")
        for (const button of tabs) {
          const label = await button.evaluate((element) => (element.textContent ?? "").trim())
          if (/^Gaps \(/.test(label)) { await button.click(); break }
        }
        const expandFinding = await page.$('button[aria-label^="Expand finding "]')
        if (expandFinding) await expandFinding.click()
      }
      if (fixture === "results" || fixture === "results-gaps") {
        const buttons = await page.$$("button")
        for (const button of buttons) {
          const label = await button.evaluate((element) => (element.textContent ?? "").trim())
          if (/evidence|details|useful/i.test(label)) await button.click().catch(() => undefined)
        }
      }
      await page.keyboard.press("Tab")
      const audit = await page.evaluate(() => {
        const interactive = [...document.querySelectorAll("button, a, input, select, textarea, [role=button]")]
          .filter((element) => {
            const style = getComputedStyle(element)
            const rect = element.getBoundingClientRect()
            return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0
          })
        const unnamed = interactive.filter((element) => !(element.getAttribute("aria-label") || element.getAttribute("title") || (element.textContent ?? "").trim())).length
        const smallTargets = interactive.filter((element) => {
          const rect = element.getBoundingClientRect()
          return rect.width < 44 || rect.height < 44
        }).length
        const clippedText = [...document.querySelectorAll("p, span, h1, h2, h3, button, label")].filter((element) => {
          const style = getComputedStyle(element)
          return style.overflow !== "hidden" && (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)
        }).length
        const overflowElements = [...document.querySelectorAll("body *")].filter((element) => {
          const rect = element.getBoundingClientRect()
          return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1
        }).slice(-8).map((element) => ({
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === "string" ? element.className.slice(0, 160) : "",
          text: (element.textContent ?? "").trim().slice(0, 80),
          left: Math.round(element.getBoundingClientRect().left),
          right: Math.round(element.getBoundingClientRect().right),
        }))
        const unnamedElements = interactive.filter((element) => !(element.getAttribute("aria-label") || element.getAttribute("title") || (element.textContent ?? "").trim())).slice(0, 8).map((element) => ({ tag: element.tagName.toLowerCase(), type: element.getAttribute("type"), className: typeof element.className === "string" ? element.className.slice(0, 120) : "" }))
        return {
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          unnamedInteractive: unnamed,
          smallTargets,
          clippedText,
          overflowElements,
          unnamedElements,
          focusEstablished: document.activeElement !== document.body,
        }
      })
      findings.push({ viewport: viewport.name, fixture, ...audit })
      await page.screenshot({ path: path.join(output, `${viewport.name}-${fixture}.png`), fullPage: true })
      await page.close()
      console.log(`visual-qa:complete:${viewport.name}:${fixture}`)
    }
  }
} finally {
  await browser.close()
  await server.close()
}

await writeFile(path.join(output, "audit.json"), JSON.stringify(findings, null, 2))
const failures = findings.filter((item) => item.horizontalOverflow || item.unnamedInteractive > 0 || item.clippedText > 0 || !item.focusEstablished)
console.log(JSON.stringify({ artifacts: output, checks: findings.length, failures, maxSmallTargets: Math.max(...findings.map((item) => item.smallTargets)) }, null, 2))
if (failures.length > 0) process.exitCode = 1
