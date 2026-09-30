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
    //viewport : {width: 720, height : 720} // will override the default and open the browser in specifc dimension
    // ...devices['iPhone 11 Pro Max'] // to execute in any specific device size
    //ignoreHttpsErros: true //this is for accepting ssl cert error and proceed with scriptin
    // permissions: ['geolocations'] //to handle browser spcifc blocker like allow location, allow notficastion,etc..
    //video: 'retain-on-failure' //will generate video on failure
  },
  reporter: 'html',
});

module.exports = Config

/*
screenshot : 'only-on-failure' - to take screenshot only on failures


Notes:
1. To have custom Configs, we can create another playwright.config1.js and define the things we need
    run with => npx playwright ... --config filename.js 

2. To run the pw scripts in multiple browser or setups best way is
    projects : [
    name : Chrome {
     use : {
    }
},
name: edge{
}   
    ]
  
    run with => npx playwright ... --config filename.js --project projectname


    3. 

*/