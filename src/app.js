const express = require('express');
const config = require('./config');
const {engine}=require('express-handlebars');
const path = require('path');
const app = express();
//settings
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
//router
app.use(require('./routers/index.routers'));
module.exports = app; // solo const export = require con module.exports