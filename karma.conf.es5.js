const customize = require('@author.io/karma-customelements')('test/es5', './dist/author-element.es5.js')

module.exports = config => {
  config.set(Object.assign(customize(config), {
    concurrency: 3
  }))
}
