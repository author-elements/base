const test = require('tape').test

test('Sanity', t => {
  t.ok(typeof AuthorElement === 'function', 'Base class detected.')
  t.end()
})

test.onFinish(() => console.log('yo'))
