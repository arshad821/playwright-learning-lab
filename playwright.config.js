// @ts-check
import { defineConfig, devices } from '@playwright/test';

const Config = ({
  testDir: './tests',
  //maxium timeout test can run for 
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  use:{
    browserName: 'chromium',
    headless: false,
    screenshot : 'on', // to create screenshot for each step in report
    trace : 'on', // 'retain-on-failure', //to log traces in report only when it fails
    actionTimeout: 10 * 1000, //set maximum time for each action to complete, like click, fill, etc.\
    navigationTimeout: 30 * 1000, //set maximum time for navigation to complete
  },
  reporter: 'html',
});

module.exports = Config

