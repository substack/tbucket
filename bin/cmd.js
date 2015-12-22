#!/usr/bin/env node
//var weekly = require('../')
var split = require('split2')
var through = require('through2')
var strftime = require('strftime')
var parse = require('parse-messy-schedule')
var parset = require('parse-messy-time')
var minimist = require('minimist')

var argv = minimist(process.argv.slice(2), {
  alias: { s: 'separator' },
  string: [ 'separator' ],
  default: { separator: '/\\s+/' }
})
var timestr = argv._.join(' ')
var time = 'every ' + ({ week: 'sunday' }[timestr] || timestr)
var buckets = {}

var flags = /\/(\w*)$/.exec(argv.separator)[1]
var sep = /^\/.*\/\w*$/.test(argv.separator)
  ? RegExp(argv.separator.replace(/^\/|\/\w*$/g, ''), flags)
  : String(argv.separator)
var delim = RegExp(sep.source, flags + 'g')

process.stdin.on('error', function () {})
process.stdin
  .pipe(split())
  .pipe(through(write))
  .pipe(process.stdout)

function write (line, enc, next) {
  line = line.toString()
  var parts = line.split(sep)
  var delims = line.match(delim)
  var p = parse(time)
  var pt = parset(parts[0])
  var t = p.prev(parts[0])
  if (p.next(t).toISOString() === pt.toISOString()) {
    t = pt
  }
  var stamp = strftime('%F', t)
  if (!buckets[stamp]) buckets[stamp] = []

  var res = [ stamp ]
  for (var i = 1; i < parts.length; i++) {
    res.push(delims[i-1], parts[i])
  }
  next(null, res.join('') + '\n')
}
