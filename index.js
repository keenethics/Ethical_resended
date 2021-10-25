const routes = require('./components/js/inits');
const express = require('express');
const validation = require('./components/js/validation');
let app = express();

app.use(express.json({ verify: validation.slackVerifyingMiddleware}));
app.use(express.urlencoded({ extended: true}));

routes.initRoutes(app);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started!');
})