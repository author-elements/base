const base = require('./karma.base')('test/es6-modules')
const files = base.getFiles('./dist/author-element.js', true)

base.displayFiles(files)
base.modernOnly = true

module.exports = function (config) {
  // Browsers to run on Sauce Labs
  // var customLaunchers = base.browsers

  config.set(Object.assign(base.configuration, {
    // list of files / patterns to load in the browser
    browserify: {
      transform: [ 'rollupify' ]
    },
    files,
    logLevel: config.LOG_INFO
  }))
}
