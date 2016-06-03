var split = require('split2')
var through = require('through2')
var strftime = require('strftime')
var parse = require('parse-messy-schedule')
var parset = require('parse-messy-time')
var combine = require('stream-combiner2')
var xtend = require('xtend')

module.exports = function (timestr, opts) {
  if (!opts) opts = {}
  var sep = opts.separator || opts.sep || /\s+/
  var delim = opts.delimiter || opts.delim || ' '
  if (/^(week(s|ly)?|w)$/i.test(timestr)) timestr = 'every sunday'
  else if (/^(month(s|ly)?|m)$/i.test(timestr)) timestr = 'the 1st'
  else if (/^(year(s|ly)?|y)$/i.test(timestr)) timestr = 'jan 1'
  else if (!/^(every|each)\b/.test(timestr)) timestr ='every ' + timestr
  if (!timestr) timestr = 'every day'
  if (opts.objectMode
  || (opts.writableObjectMode && opts.readableObjectMode)) {
    return obj(timestr, opts)
  }

  if (typeof sep === 'string' && /^\/.*\/\w*$/.test(sep)) {
    var flags = /\/(\w*)$/.exec(sep)[1]
    sep = RegExp(sep.replace(/^\/|\/\w*$/g, ''), flags)
    if (!delim) delim = RegExp(sep.source, flags + 'g')
  }
  var column = opts.column || 0
  var pipeline = []
  if (!opts.writableObjectMode) {
    pipeline.push(split(), through.obj(parse))
  }
  pipeline.push(obj(timestr, opts))
  if (!opts.readableObjectMode) {
    pipeline.push(through.obj(unparse))
  }
  return combine.obj(pipeline)
  function parse (line, enc, next) {
    var row = line.toString().split(sep)
    var key = row.splice(column, 1)[0]
    next(null, { key: key, value: row })
  }
  function unparse (row, enc, next) {
    var values = row.value.slice()
    values.splice(column, 0, row.key)
    next(null, values.join(delim) + '\n')
  }
}
module.exports.obj = obj

function obj (timestr, opts) {
  if (!opts) opts = {}
  var p = parse(timestr)
  return through.obj(write)

  function write (row, enc, next) {
    var pt = parset(row.key)
    var t = p.prev(row.key)
    if (timeeq(p.next(t), pt)) t = pt
    var stamp = strftime('%F', t)
    next(null, xtend(row, { key: stamp }))
  }
}

function timeeq (a, b) {
  return strftime('%F %T', a) === strftime('%F %T', b)
}
