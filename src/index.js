
function notifyAirbrake(airbrake) {
  return function(ctx, next) {
    return next().catch((err)=> {
      airbrake.notify(err);
      throw err;
    });
  }
}

module.exports = exports = notifyAirbrake;
