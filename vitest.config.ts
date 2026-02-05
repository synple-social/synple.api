import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: [ "test/**/*.e2e-spec.ts"],
    globals: true,
    root: './',
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})