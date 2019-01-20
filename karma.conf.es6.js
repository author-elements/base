const base = require('./karma.base')('test/es6')
const files = base.getFiles('./dist/author-element.js')

base.displayFiles(files)
base.modernOnly = true

module.exports = function (config) {
  config.set(Object.assign(base.configuration, {
    browserify: {
      transform: [ 'rollupify' ]
    },
    files,
    logLevel: config.LOG_INFO
  }))
}
