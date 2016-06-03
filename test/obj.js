var test = require('tape')
var tbucket = require('../')

test('obj read', function (t) {
  var expected = [
    { key: '2016-05-29', value: [ 'a' ] },
    { key: '2016-05-29', value: [ 'b' ] },
    { key: '2016-06-05', value: [ 'c' ] },
    { key: '2016-06-12', value: [ 'd' ] },
    { key: '2016-07-03', value: [ 'e' ] },
    { key: '2016-06-05', value: [ 'f' ] }
  ]
  t.plan(expected.length)
  var b = tbucket('weekly', { readableObjectMode: true })
  b.on('data', function (row) {
    t.deepEqual(row, expected.shift())
  })
  b.write('2016-06-01 a\n2016-05-29')
  b.write(' b\n2016-06-05 c\n2016-06-13 d')
  b.write('\n2016-07-04 e\n2016-06-06 f\n')
})
