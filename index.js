var split = require('split2')
var through = require('through2')
var strftime = require('strftime')
var parse = require('parse-messy-schedule')
var parset = require('parse-messy-time')
var combine = require('stream-combiner2')
var xtend = require('xtend')

module.exports = function (timestr, opts) {
  if (!opts) opts = {}
  if (opts.objectMode
  || (opts.writableObjectMode && opts.readableObjectMode)) {
    return obj(timestr, opts)
  }
  var sep = opts.separator || opts.sep || /\s+/
  var delim = opts.delimiter || opts.delim || ' '
  if (timestr === 'week') timestr = 'sunday'
  if (!/^(every|each)\b/.test(timestr)) timestr ='every ' + timestr
  if (typeof sep === 'string' && /^\/.*\/\w*$/.test(sep)) {
    var flags = /\/(\w*)$/.exec(sep)[1]
    sep = RegExp(sep.replace(/^\/|\/\w*$/g, ''), flags)
    if (!delim) delim = RegExp(sep.source, flags + 'g')
  }
  var column = opts.column || 0
  var pipeline = []
  if (!opts.readableObjectMode) {
    pipeline.push(split(), through.obj(parse))
  }
  pipeline.push(obj(timestr, opts))
  if (!opts.writableObjectMode) {
    pipeline.push(through.obj(unparse))
  }
  return combine(pipeline)
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