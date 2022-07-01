const express = require('express');
const config = require('./config');
const {engine}=require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const morgan = require('morgan');
const app = express();
//settings
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.engine(
    '.hbs', 
    engine({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs'
    })
);
app.set('view engine', '.hbs');
//middlewares
app.use(morgan('dev'));
//router
app.use(require('./routers/index.routers'));
module.exports = app; // solo const export = require con module.exports