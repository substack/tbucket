var test = require('tape')
var tbucket = require('../')
var split = require('split2')

test('weekly', function (t) {
  var expected = [
    '2016-05-29 a',
    '2016-05-29 b',
    '2016-06-05 c',
    '2016-06-12 d',
    '2016-07-03 e',
    '2016-06-05 f'
  ]
  t.plan(expected.length)
  var b = tbucket('weekly')
  b.pipe(split()).on('data', function (buf) {
    t.equal(buf.toString(), expected.shift())
  })
  b.write('2016-06-01 a\n2016-05-29')
  b.write(' b\n2016-06-05 c\n2016-06-13 d')
  b.write('\n2016-07-04 e\n2016-06-06 f\n')
})

test('monthly', function (t) {
  var expected = [
    '2016-06-01 a',
    '2016-05-01 b',
    '2016-06-01 c',
    '2016-06-01 d',
    '2016-07-01 e',
    '2016-06-01 f'
  ]
  t.plan(expected.length)
  var b = tbucket('monthly')
  b.pipe(split()).on('data', function (buf) {
    t.equal(buf.toString(), expected.shift())
  })
  b.write('2016-06-01 a\n2016-05-29')
  b.write(' b\n2016-06-05 c\n2016-06-13 d')
  b.write('\n2016-07-04 e\n2016-06-06 f\n')
})
