const base = require('./karma.base')('test/es5')
const files = base.getFiles('./dist/author-element.es5.js')

base.displayFiles(files)

module.exports = function (config) {
  config.set(Object.assign(base.configuration, {
    files,
    logLevel: config.LOG_INFO
  }))
}
