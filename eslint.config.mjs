import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    ".pnpm-store-release/**",
    "out/**",
    "dist/**",
    "coverage/**",
    ".playwright/**",
    "playwright-report/**",
    "test-results/**",
    "docs/dashboard/evidence/**",
    "api-types/**",
    "next-env.d.ts",
  ]),
  ...nextVitals,
]);
