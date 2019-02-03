var test = require('tape')

setTimeout(function () {
  test('Sanity', function (t) {
    t.ok(typeof AuthorElement === 'function', 'Base class detected.')
    t.end()
  })
}, 8000)
