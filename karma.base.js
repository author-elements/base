// Karma configuration
require('localenvironment')

var browserslist = require('browserslist')
var reporterEngines = ['spec']
// var reporterEngines = ['spec', 'coverage']
var sauceConfiguration = { // eslint-disable-line no-unused-vars
  testName: 'Author.io Base Element',
  build: process.env.BUILD_NUMBER || 1,
  recordVideo: false,
  recordScreenshots: false
}

var b = {}
Object.keys(browserslist.data).filter(browser => {
  return /op_|opera|ie_mob|samsung/i.exec(browser) === null
}).map(browserName => {
  var browser = browserslist.data[browserName]
  return `${browser.name} ${browser.released.pop()}`
}).forEach(function (item, index, arr) {
  item = item.split(' ')
  var attr = (item[0] === 'edge' ? 'microsoft' : '') + item[0].toLowerCase()

  if (attr === 'ie') {
    attr = 'internet explorer'
  }

  b[attr] = item[1]
})

// Construct Browser Testing List
var browsers = {}
var keys = Object.keys(b)

for (var i = 0; i < keys.length; i++) {
  var brwsr = keys[i].replace(/\.|\s/, '_')

  browsers['sl_' + brwsr + '_' + b[keys[i]].replace(/\.|\s/, '_')] = {
    base: 'SauceLabs',
    browserName: keys[i],
    version: b[keys[i]]
  }
}

browsers['sl_chrome_45'] = {
  base: 'SauceLabs',
  browserName: 'chrome',
  version: '45'
}

browsers['sl_firefox_50'] = {
  base: 'SauceLabs',
  browserName: 'firefox',
  version: '50'
}

// console.log(JSON.stringify(browsers, null, 2))
var chalk = require('chalk')
var rows = [[chalk.bold('Browser'), chalk.bold('Version')]]
Object.keys(browsers).sort().forEach(slbrowser => {
  rows.push([browsers[slbrowser].browserName, browsers[slbrowser].version])
})

var tablemaker = require('table').table
console.log(tablemaker(rows, {
  columns: {
    1: {
      alignment: 'right'
    }
  }
}))

module.exports = {
  tablemaker,
  chalk,
  browserslist,
  reporterEngines,
  sauceConfiguration
}
