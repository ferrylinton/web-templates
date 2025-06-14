const path = require('path');
const express = require('express');
const favicon = require('express-favicon');
const cookieParser = require('cookie-parser');
const homeRouter = require('./routers/home-router');
const { NODE_ENV, WEB_TEMPLATE_FOLDER } = require('./configs/constant');
const handlebars = require('./configs/handlebars');
const i18n = require('./configs/i18n');

const app = express();
app.use(cookieParser());
i18n(app);
handlebars(app);

app.set('trust proxy', 1);
app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/templates', express.static(WEB_TEMPLATE_FOLDER));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
	res.locals.currentPath = req.path;
	res.locals.NODE_ENV = NODE_ENV;
	res.locals.locale = req.getLocale();
	next();
});

// map router to express application
app.use('/', homeRouter);

// 404 / not found handler
app.use((_req, res, _next) => {
	res.render('not-found');
});

// error handler
app.use((err, _req, res, _next) => {
	console.error(err);
	res.render('error');
});

module.exports = app;
