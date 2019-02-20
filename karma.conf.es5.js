let customize = require('@author.io/karma-customelements')('test/es5', './dist/author-element.es5.js', 'BrowserStack')
//
// module.exports = config => {
//   config.set(Object.assign(customize(config), {
//     concurrency: 1
//   }))
// }

// require('leaked-handles').set({
//   // fullStack: true, // use full stack traces
//   timeout: 45000 // run every 30 seconds instead of 5.
//   // debugSockets: true
// })

// const path = require('path')
// let customize = require('@author.io/karma-customelements')('SauceLabs')
module.exports = config => {
  config.set(Object.assign(customize(config), {
    captureTimeout: 0,
    concurrency: 1,
    singleRun: false
  }))
}
// let preprocessors = (root) => {
//   let cfg = {}
//
//   cfg[`${root}/**/*.js`] = ['browserify']
//   cfg[`${root}/test.html`] = 'html2js'
//
//   return cfg
// }
//
// let custombase = Object.assign({}, base)
// delete custombase.getFiles
// custombase.getFiles = (root, file, module = false) => {
//   let mainfile = {
//     pattern: path.join(process.cwd(), file),
//     nocache: true
//   }
//
//   if (module) {
//     mainfile.type = 'module'
//   }
//
//   return [
//     mainfile,
//     path.join(root, '/*.js'),
//     path.join(root, 'test.html')
//   ]
// }
//
// module.exports = function(config) {
//   config.set(Object.assign(custombase.configuration, {
//     browserStack: {
//       username: 'coreybutler2',
//       accessKey: '5Myqq6xsMexxpq4YeHRT'
//     },
//     concurrency: 1
//   }))
// }
