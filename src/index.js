
function notifyAirbrake(airbrake, options = {}) {
  const defaultComponent = options.component || "koa";

  return function(ctx, next) {
    return next().catch((err)=> {
      const req = ctx.request;
      
      const notice = {};

      notice.error = err;

      // Some libraries like Axios directly annotate error object 
      // with contextual info such as error code, req url. 
      // Add these to `environment` field of the notice.
      // These go in the `environment` and not in the `context` field
      // because that's how we used to send notice to old Airbrake.
      const keys = Object.keys(err);
      notice.environment = {};
      keys.forEach((key)=> {
        notice.environment[key] = err[key];
      });

      notice.context = {
        url : req.url,
        action : req.url,
        component : err.component || defaultComponent,
        httpMethod : req.method,
        session : req.session,
        ua : req.headers['User-Agent'] 
      };

      notice.params = req.body;
        
      airbrake.notify(notice);
      throw err;
    });
  };
}

module.exports = exports = notifyAirbrake;
