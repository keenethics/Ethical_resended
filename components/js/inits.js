const auth = require('./auth');
const events = require('./events');
const interacts = require('./interactives');

module.exports.initRoutes = (app) => {
    app.use('/slack/auth', auth.authRouter);
    app.use('/slack/events', events.eventRouter);
    app.use('/slack/interactive-endpoint', interacts.interactivityRouter);
}
