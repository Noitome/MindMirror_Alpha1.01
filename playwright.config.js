import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    timeout: 60000,
    reuseExistingServer: !process.env.CI,
  },
});
