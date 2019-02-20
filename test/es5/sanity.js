var test = require('tape').test

test('Sanity', function (t) {
  t.ok(typeof AuthorElement === 'function', 'Base class detected.')
  t.end()
})

// test.onFinish(() => console.log('done'))
