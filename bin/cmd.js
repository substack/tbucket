#!/usr/bin/env node
//var weekly = require('../')
var split = require('split2')
var through = require('through2')
var strftime = require('strftime')
var parse = require('parse-messy-schedule')
var minimist = require('minimist')

var argv = minimist(process.argv.slice(2))
var buckets = {}

process.stdin.on('error', function () {})
process.stdin
  .pipe(split())
  .pipe(through(write))
  .pipe(process.stdout)

function write (line, enc, next) {
  var parts = line.toString().split(/\s+/)
  var p = parse('every sunday')
  var stamp = strftime('%F', p.prev(parts[0]))
  if (!buckets[stamp]) buckets[stamp] = []
  next(null, stamp + ' ' + parts.slice(1).join(' ') + '\n')
}
