const test = require('tape').test

test('Sanity', t => {
  t.ok(typeof AuthorBaseElement === 'function', 'Base class detected.')
  t.end()
})
