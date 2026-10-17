import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const fixture = (name: string) => fileURLToPath(new URL(`./${name}`, import.meta.url))

const config = {
  root: fileURLToPath(new URL(".", import.meta.url)),
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: [
      { find: "@/lib/trpc", replacement: fixture("trpc-stub.ts") },
      { find: "@/lib/auth-store", replacement: fixture("auth-store-stub.ts") },
      { find: "@/lib/plan-context", replacement: fixture("plan-context-stub.ts") },
      { find: "@/lib/analytics", replacement: fixture("analytics-stub.ts") },
      { find: "@/components/plan/feature-gate", replacement: fixture("feature-gate-stub.tsx") },
      { find: "next/dynamic", replacement: fixture("dynamic-stub.tsx") },
      { find: "@", replacement: root },
    ],
  },
  server: { host: "127.0.0.1", fs: { allow: [root] } },
}

export default config
