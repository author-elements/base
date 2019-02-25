let customize = require('@author.io/karma-customelements')('test/es5', './dist/author-base.es5.js', 'BrowserStack')
// require('leaked-handles').set({
//   // fullStack: true, // use full stack traces
//   timeout: 10000 // run every 30 seconds instead of 5.
//   // debugSockets: true
// })

// const path = require('path')
// let customize = require('@author.io/karma-customelements')('SauceLabs')
module.exports = config => {
  config.set(Object.assign(customize(config), {
    captureTimeout: 120000,
    browserNoActivityTimeout: 120000,
    concurrency: 3,
    logLevel: config.LOG_INFO
  }))
}
