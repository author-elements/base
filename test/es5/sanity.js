var test = require('tape').test

test('Sanity', function (t) {
  t.ok(typeof AuthorBaseElement === 'function', 'Base class detected.')
  t.end()
})

// test.onFinish(() => console.log('done'))
