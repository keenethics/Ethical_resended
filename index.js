const routes = require('./components/js/inits');
const bodyParser = require('body-parser');
let app = require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

routes.initRoutes(app);

app.listen(process.env.PORT, () => {
    console.log('Server started!');
})