// @ts-check
import { defineConfig, devices } from '@playwright/test';

const Config = ({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  use:{
    browserName: 'chromium',
    headless: false,
  },
  reporter: 'html',
});

module.exports = Config

