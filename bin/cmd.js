#!/usr/bin/env node
var tbucket = require('../')
var minimist = require('minimist')

var argv = minimist(process.argv.slice(2), {
  alias: { s: 'separator', d: 'delimiter' },
  string: [ 'separator', 'delimiter' ],
  default: {
    separator: '/\\s+/',
    delimiter: ' '
  }
})
var timestr = argv._.join(' ')
process.stdin.on('error', function () {})
process.stdin
  .pipe(tbucket(timestr, argv))
  .pipe(process.stdout)
