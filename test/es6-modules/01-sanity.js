import AuthorBaseElement from '../../author-base.js'

const test = require('tape').test

test('Sanity', t => {
  t.ok(typeof AuthorBaseElement === 'function', 'Base class detected.')
  t.end()
})

// test('Extend Base Class', function (t) {
//   class
// })
