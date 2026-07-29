import { spawnSync } from "node:child_process";

const commands = [
  {
    label: "Taste Skill",
    command: "npx",
    args: [
      "--yes",
      "skills",
      "add",
      "https://github.com/leonxlnx/taste-skill",
      "--skill",
      "design-taste-frontend",
    ],
  },
  {
    label: "Impeccable",
    command: "npx",
    args: [
      "--yes",
      "impeccable",
      "install",
      "--scope=project",
      "--providers=claude,codex,cursor,gemini,github",
    ],
  },
];

for (const item of commands) {
  console.log(`\nInstalling ${item.label}...`);

  const result = spawnSync(item.command, item.args, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(`Failed to start ${item.label}:`, result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`${item.label} installation exited with code ${result.status}.`);
    process.exit(result.status ?? 1);
  }
}

console.log("\nDesign skills installed successfully.");
console.log("Restart your AI coding tool, then run /impeccable init.");
console.log("Use the design-taste-frontend skill for homepage redesign work.");
