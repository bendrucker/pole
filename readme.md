# pole [![Build Status](https://travis-ci.org/bendrucker/pole.svg?branch=master)](https://travis-ci.org/bendrucker/pole)

> Poll for async resources with an evented interface


## Install

```
$ npm install --save pole
```


## Usage

```js
var poll = require('pole')

var user = pole(function (callback) {
  getUser(callback)  
})

user.onData(console.log)
user.onError(console.error)

user.cancel()
//=> stop polling and ignore any pending responses
```

## API

#### `poll([options], fn)` -> `object`

Returns a polling interface.

###### `onData(listener)` -> `function`

Calls `listener` when the polling request suceeded with the yielded value. Returns an unlisten function.

###### `onError(listener)` -> `function`

Calls `listener` when the polling request fails with the yielded error. Returns an unlisten function.

###### `cancel()` -> `undefined`

Stops the polling loop and ignores any pending responses.

##### options

Type: `object`

###### interval

Type: `number` / `function`  
Default: `0`

The interval in milliseconds between successful requests. This parameter can optionally be a function that will be called when data arrives and should return the interval as a number.

###### retryDelay

Type: `number`  
Default: `1000`

The interval in milliseconds between retries after failure. Retries are performed using exponential backoff. Given a `retryDelay` of `1000`, the first retry will be performed after 1 second, then 2, then 4, etc.

###### maxRetryDelay

Type: `number`  
Default: `30000`

The maximum interval in milliseconds between retries.

###### maxAttempts

Type: `number`  
Default: `5`

The number of attempts in total to make, including an initial attempt and `maxAttempts - 1` retries with backoff.

##### fn

Type: `function`  
Arguments: `callback<err, data>`

A function that will be called with a polling handler. `callback` is a Node errback.


## License

MIT © [Ben Drucker](http://bendrucker.me)
