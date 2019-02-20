const customize = require('@author.io/karma-customelements')('test/es6-modules', './dist/author-element.js', 'BrowserStack')

module.exports = config => {
  config.set(Object.assign(customize(config, true, true), {
    browserify: {
      transform: [ 'rollupify' ]
    },
    concurrency: 1,
    captureTimeout: 65000,
    browserNoActivityTimeout: 70000
  }))
}
