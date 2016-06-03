#!/usr/bin/env node
var tbucket = require('../')
var minimist = require('minimist')
var fs = require('fs')
var path = require('path')

var argv = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    s: ['sep','separator'],
    d: ['del','delim','delimiter']
  },
  string: [ 'separator', 'delimiter' ],
  default: {
    separator: '/\\s+/',
    delimiter: ' '
  }
})
if (argv.help || argv._[0] === 'help') return usage()

var timestr = argv._.join(' ')
process.stdin.on('error', function () {})
process.stdin
  .pipe(tbucket(timestr, argv))
  .pipe(process.stdout)

function usage (code) {
  fs.createReadStream(path.join(__dirname, 'usage.txt'))
    .pipe(process.stdout)
}
