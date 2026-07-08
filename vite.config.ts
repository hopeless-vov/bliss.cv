import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import svgLoader from 'vite-svg-loader'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // svgLoader lets `*.svg?component` imports become Vue components (keeps
  // currentColor + class pass-through) while the icons stay real .svg files.
  plugins: [vue(), svgLoader(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // The contract: all *logic* is fully covered. Components/views are
      // exercised by e2e; logic lives in composables/stores/utils and must
      // hit 100%.
      include: ['src/composables/**', 'src/stores/**', 'src/utils/**'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})
