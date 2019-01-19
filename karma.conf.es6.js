const base = require('./karma.base')

var getFiles = function () {
  var files = [
    {
      pattern: require('path').join(process.cwd(), './dist/author-element.js'),
      nocache: true
    }
  ]

  // Run all tests by default
  let testfiles = 'test/es6/*.js'

  return files.concat([
    testfiles,
    'test/es6/test.html'
  ])
}

console.log(base.tablemaker([[base.chalk.bold('Included Files')]].concat(getFiles().map(file => { return [file] }))))

module.exports = function (config) {
  config.set({

    plugins: [
      require('karma-browserify'),
      require('tape'),
      require('karma-tap'),
      require('karma-spec-reporter'),
      require('karma-chrome-launcher'),
      // require('karma-firefox-launcher'),
      // require('karma-safari-launcher'),
      // require('karma-ie-launcher'),
      // require('karma-edge-launcher'),
      // require('karma-phantomjs-launcher'),
      // require('karma-sauce-launcher'),
      require('karma-html2js-preprocessor')
    ],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['tap', 'browserify'],

    // list of files / patterns to load in the browser
    files: getFiles(),

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/es6/**/*.js': ['browserify'],
      'test/es6/test.html': 'html2js'
      // , 'test/lib/**/*.js': 'coverage'
    },

    // coverageReporter: {
    //   type : 'html',
    //   dir : 'coverage/'
    // },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: base.reporterEngines, // ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: 3
  })
}
