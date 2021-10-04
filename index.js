const routes = require('./components/inits');
const bodyParser = require('body-parser');
let app = require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

routes.initRoutes(app);

app.listen(3000, () => {
    console.log('Server started!');
})