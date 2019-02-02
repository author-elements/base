const customize = require('@author.io/karma-customelements')('test/es6', './dist/author-element.js')

module.exports = config => {
  config.set(Object.assign(customize(config, true, false), {
    browserify: {
      transform: [ 'rollupify' ]
    }
  }))
}
