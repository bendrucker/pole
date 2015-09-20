'use strict'

var test = require('tape')
var poll = require('./')

test('basic loop', function (t) {
  t.plan(3)

  var i = 0
  var count = poll(function (callback) {
    if (i > 3) count.cancel()
    callback(null, i++)
  })

  count.onData(function (i) {
    t.pass('data: i = ' + i)
  })

  count.onError(t.fail)
})

test('error retry', function (t) {
  t.plan(5)

  var options = {
    retryDelay: 10
  }

  var count = poll(options, function (callback) {
    callback(new Error('error'))
  })

  count.onData(t.fail)

  count.onError(function (err) {
    t.equal(err.message, 'error')
  })
})
