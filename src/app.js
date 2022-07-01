const express = require('express');
const config = require('./config');
const {engine}=require('express-handlebars');
const path = require('path');
const app = express();
app.set('port', config.port);
module.exports = app; // solo const export = require con module.exports