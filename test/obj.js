var test = require('tape')
var split = require('split2')
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

test('obj write', function (t) {
  var expected = [
    '2016-05-29 a',
    '2016-05-29 b',
    '2016-06-05 c',
    '2016-06-12 d',
    '2016-07-03 e',
    '2016-06-05 f'
  ]
  t.plan(expected.length)
  var b = tbucket('weekly', { writableObjectMode: true })
  b.pipe(split()).on('data', function (buf) {
    t.equal(buf.toString(), expected.shift())
  })
  b.write({ key: '2016-06-01', value: ['a'] })
  b.write({ key: '2016-05-29', value: ['b'] })
  b.write({ key: '2016-06-05', value: ['c'] })
  b.write({ key: '2016-06-13', value: ['d'] })
  b.write({ key: '2016-07-04', value: ['e'] })
  b.write({ key: '2016-06-06', value: ['f'] })
})

test('obj read+write', function (t) {
  var expected = [
    { key: '2016-05-29', value: [ 'a' ] },
    { key: '2016-05-29', value: [ 'b' ] },
    { key: '2016-06-05', value: [ 'c' ] },
    { key: '2016-06-12', value: [ 'd' ] },
    { key: '2016-07-03', value: [ 'e' ] },
    { key: '2016-06-05', value: [ 'f' ] }
  ]
  t.plan(expected.length)
  var b = tbucket('weekly', {
    readableObjectMode: true,
    writableObjectMode: true
  })
  b.on('data', function (row) {
    t.deepEqual(row, expected.shift())
  })
  b.write({ key: '2016-06-01', value: ['a'] })
  b.write({ key: '2016-05-29', value: ['b'] })
  b.write({ key: '2016-06-05', value: ['c'] })
  b.write({ key: '2016-06-13', value: ['d'] })
  b.write({ key: '2016-07-04', value: ['e'] })
  b.write({ key: '2016-06-06', value: ['f'] })
})

test('obj read+write: objectMode', function (t) {
  var expected = [
    { key: '2016-05-29', value: [ 'a' ] },
    { key: '2016-05-29', value: [ 'b' ] },
    { key: '2016-06-05', value: [ 'c' ] },
    { key: '2016-06-12', value: [ 'd' ] },
    { key: '2016-07-03', value: [ 'e' ] },
    { key: '2016-06-05', value: [ 'f' ] }
  ]
  t.plan(expected.length)
  var b = tbucket('weekly', { objectMode: true })
  b.on('data', function (row) {
    t.deepEqual(row, expected.shift())
  })
  b.write({ key: '2016-06-01', value: ['a'] })
  b.write({ key: '2016-05-29', value: ['b'] })
  b.write({ key: '2016-06-05', value: ['c'] })
  b.write({ key: '2016-06-13', value: ['d'] })
  b.write({ key: '2016-07-04', value: ['e'] })
  b.write({ key: '2016-06-06', value: ['f'] })
})
