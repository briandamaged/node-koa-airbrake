
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

      err.environment = {};


      //NOTE: The following conditional handle axios specific errors. Hmmm...
      if(err.config) {
        err.environment.config = err.config;
      }

      if(err.code) {
        err.environment.code = err.code;
      }
     
      airbrake.notify(err);
      throw err;
    });
  }
}

module.exports = exports = notifyAirbrake;
