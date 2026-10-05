import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
  test: {
    environment: "jsdom",
    pool: "forks",
    maxWorkers: 3,
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/api-types/**",
      "**/.pnpm-store-release/**",
      "**/coverage/**",
      "**/.playwright/**",
      "**/playwright-report/**",
      "**/test-results/**",
    ],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
})
