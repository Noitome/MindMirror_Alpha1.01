// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/components/__tests__/**/*.{test,spec}.jsx'],
    environment: 'jsdom',
  },
});
