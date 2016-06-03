var tbucket = require('../')
var timestr = process.argv.slice(2).join(' ')

process.stdin
  .pipe(tbucket(timestr, { readableObjectMode: true }))
  .on('data', console.log)
