#!/usr/bin/env node
//var weekly = require('../')
var split = require('split2')
var through = require('through2')
var strftime = require('strftime')
var parsem = require('parse-messy-time')
var minimist = require('minimist')

var argv = minimist(process.argv.slice(2))
var reduce = null
if (argv.c === 'sum') reduce = sum

function sum (args, cb) {
  cb(null, args.reduce(function (sum, arg) {
    return sum + Number(arg)
  }, 0))
}

var weeks = {}

process.stdin
  .pipe(split())
  .pipe(through(write, end))

process.stdin.on('error', function () {})

function write (line, enc, next) {
  var parts = line.toString().split(/\s+/)
  var week = strftime('%F', weekof(parsem(parts[0])))
  if (!weeks[week]) weeks[week] = []
  weeks[week].push(parts.slice(1))
  next()
}

function end (next) {
  var keys = Object.keys(weeks).sort()
  ;(function advance () {
    if (keys.length === 0) return next()
    var week = keys.shift()
    reduce(weeks[week], function (err, res) {
      console.log(week, res)
      advance()
    })
  })()
}

function weekof (d) {
  var w = new Date
  w.setFullYear(d.getFullYear())
  w.setMonth(d.getMonth())
  w.setDate(d.getDate() - d.getDay())
  return w
}
