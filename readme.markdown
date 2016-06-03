# tbucket

group dates into time buckets

This command and API modifies the dates given as input to the nearest bucket for
the given time string. This way you can create "buckets" of time to lump events
in.

# example

```
$ echo -e '2015-11-24 3\n2015-11-12 4\n2015-11-22 5' \
  | tbucket week | sort
2015-11-08 4
2015-11-22 3
2015-11-22 5
```

# api example

```
var tbucket = require('tbucket')
var timestr = process.argv.slice(2).join(' ')

process.stdin
  .pipe(tbucket(timestr))
  .pipe(process.stdout)
```

output:

```
$ echo -e '2015-11-24 3\n2015-11-12 4\n2015-11-22 5' \
  | node lines.js week | sort
2015-11-08 4
2015-11-22 3
2015-11-22 5
```

# api

``` js
var tbucket = require('tbucket')
```

## var stream = tbucket(timestr, opts)

Create a bucket transform stream from a [recurring time string][1].

Some example values for a time string:

* weekly
* monthly
* yearly
* every tuesday

By default, the `stream` expects lines of text as input with leading date
strings and produces lines of text as output.

* `opts.readableObjectMode` - when `true`, produce objects as output
* `opts.writableObjectMode` - when `true`, expect objects as input
* `opts.objectMode` - when `true`, produce objects as output and expect objects
as input

In object mode (both read and write), the objects should have both `key` and
`value` properties.

[1]: https://npmjs.com/package/parse-messy-schedule

# install

To install the library:

```
npm install tbucket
```

To install the command:

```
npm install tbucket -g
```

# license

BSD
