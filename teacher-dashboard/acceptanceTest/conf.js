'use strict'
require('babel-register')
exports.config = {
    framework: 'mocha',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['App_spec.js'],
    onPrepare: () => {
        browser.ignoreSynchronization = true
    },
    mochaOpts: {
        enableTimeouts: false
    },
    capabilities: {
        'browserName': 'chrome',
        chromeOptions: {
            args: [ "--headless", "--disable-gpu", "--window-size=800x600" ]
        }
    },
    baseUrl: process.env.BASE_URL
}