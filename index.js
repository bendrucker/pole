'use strict'

var extend = require('xtend')
var Event = require('geval/event')
var Observ = require('observ')
var increment = require('observ-increment')
var partial = require('ap').partial
var Errback = require('create-errback')
var filter = require('filter-pipe')
var smallest = require('smallest')

module.exports = poll

var defaults = {
  interval: 0,
  retryDelay: 1000,
  maxRetryDelay: 30 * 1000,
  maxAttempts: 5
}

function poll (options, fn) {
  if (typeof options === 'function') {
    fn = options
    options = {}
  }

  options = extend(defaults, options || {})

  var ErrorEvent = Event()
  var DataEvent = Event()

  var onError = ErrorEvent.listen
  var onData = DataEvent.listen

  var state = {
    canceled: Observ(false),
    attempt: Observ(0)
  }

  onError(partial(increment, state.attempt, 1))
  onData(setTimeout.bind(global, fetch, options.interval))
  onData(partial(state.attempt.set, 0))

  state.attempt(filter(Boolean, retry))

  fetch()

  return {
    onError: onError,
    onData: onData,
    cancel: cancel
  }

  function fetch () {
    if (state.canceled()) return
    var onResult = Errback(cancelable(ErrorEvent.broadcast), cancelable(DataEvent.broadcast))
    fn(onResult)
  }

  function retry (attempt) {
    if (attempt > options.maxAttempts) return
    var delay = smallest(options.maxRetryDelay, options.retryDelay * Math.pow(2, attempt))
    setTimeout(fetch, delay)
  }

  function cancel () {
    state.canceled.set(true)
  }

  function cancelable (fn) {
    return function broadcast (data) {
      if (state.canceled()) return
      fn(data)
    }
  }
}
