#!/usr/bin/env node
//var weekly = require('../')
var split = require('split2')
var through = require('through2')
var strftime = require('strftime')
var parse = require('parse-messy-schedule')
var parset = require('parse-messy-time')
var minimist = require('minimist')

var argv = minimist(process.argv.slice(2), {
  boolean: [ 'm', 'w', 'd' ],
  alias: { m: 'month', w: 'week', d: 'day' }
})
var time = argv._.join(' ')
if (argv.month) {
  time = 'every month'
} else if (argv.week) {
  time = 'every sunday'
} else if (argv.day) {
  time = 'every day'
}
var buckets = {}

process.stdin.on('error', function () {})
process.stdin
  .pipe(split())
  .pipe(through(write))
  .pipe(process.stdout)

function write (line, enc, next) {
  var parts = line.toString().split(/\s+/)
  var p = parse(time)
  var pt = parset(parts[0])
  var t = p.prev(pt)
  if (p.next(t).toISOString() === pt.toISOString()) {
    t = pt
  }
  var stamp = strftime('%F', t)
  if (!buckets[stamp]) buckets[stamp] = []
  next(null, stamp + ' ' + parts.slice(1).join(' ') + '\n')
}
