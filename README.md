# koa-airbrake #

Airbrake middleware for Koa

## Installation ##

```shell
> npm install --save koa-airbrake
```


## Usage ##

The `koa-airbrake` middleware intercepts unhandled exceptions in the Koa callstack and reports them to Airbrake.  Afterwards, it re-throws the exceptions so that they can continue being processed by the remaining middleware.

```javascript
const Koa = require('koa');
const app = new Koa();


// Setup your Airbrake client...
const AirbrakeClient = require('airbrake-js');
const airbrake = new AirbrakeClient({  
  projectId: "PROJECT_ID",
  projectKey: 'API_KEY'
});


// Plugin the "koa-airbrake" middleware
const notifyAirbrake = require('koa-airbrake');
app.use(notifyAirbrake(airbrake));


// Let's create a test endpoint that just throws an exception.
app.use(async function(ctx) {
  throw new Error("ka-BOOOOOOOOM!");
});

app.listen(3000);
```

## Gotchas ##

### Exceptions that escape Koa's Callstack ###

This middleware only handles exceptions that are part of the Koa callstack.  For example, consider this code that is using a traditional callback:


```javascript
app.use(function(ctx) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      throw new Error("Oops!  This exception is never rejected!");
    }, 1000);
  });
});
```

Since the exception is never passed to the `reject` callback, it escapes Koa's callstack; therefore it will never be observed by the `koa-airbrake` middleware.  Fortunately, the `airbrake` library itself provides a handler for these exceptions.  Just do this:

```javascript
// This will intercept any exceptions that escape Koa's callstack.
airbrake.handleExceptions();
```
