const auth = require('./auth');
const events = require('./events');

module.exports.initRoutes = (app) => {
    app.use('/slack/auth', auth.authRouter);
    app.use('/slack/events', events.eventRouter);
}
