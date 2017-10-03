
function notifyAirbrake(airbrake, options = {}) {
  const defaultComponent = options.component || "koa";

  return function(ctx, next) {
    return next().catch((err)=> {
      const req = ctx.request;
      const res = ctx.response;

      err.url = req.url;
      err.action = req.url;
      err.component = err.component || defaultComponent;
      err.httpMethod = req.method;
      err.params = req.body;
      err.session = req.session;
      err.ua = req.headers['User-Agent'];
      airbrake.notify(err);
      throw err;
    });
  }
}

function addAirbrakeFilter(airbrake, filterFn) {
  return async function(ctx, next) {
    airbrake.addFilter(filterFn);
    await next();
  }
}

module.exports = exports = {
  notifyAirbrake,
  addAirbrakeFilter
}
