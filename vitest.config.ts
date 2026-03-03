import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    globalSetup: ['./src/test/setup/globalSetup.ts'], // poprawiona ścieżka
    clearMocks: true,
    restoreMocks: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    coverage: {
      provider: 'v8',
      exclude: [
        'generated/**',
        'generated/**/*',
        'generated',
        'env.ts',
        'eslint.config.ts',
        'prisma.config.ts',
        'vitest.config.ts',
        'src/test/setup/**',
      ],
    },
  },
  plugins: [],
})
