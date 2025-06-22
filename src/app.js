const path = require('path');
const express = require('express');
const favicon = require('express-favicon');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const homeRouter = require('./routers/home-router');
const settingRouter = require('./routers/setting-router');
const themeRouter = require('./routers/theme-router');
const { NODE_ENV, WEB_TEMPLATE_FOLDER } = require('./configs/constant');
const handlebars = require('./configs/handlebars');
const i18n = require('./configs/i18n');
const { getColorsObj, generateShades, generateVariables } = require('./services/theme-service');

const app = express();
app.use(compression());
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
	try {
		if (req.cookies.theme === undefined) {
			res.cookie('theme', 'light', { maxAge: 900000, httpOnly: true });
			res.locals.theme = 'light';
		} else {
			res.locals.theme = req.cookies.theme;
		}

		if (req.query.theme && ['dark', 'light'].includes(req.query.theme)) {
			res.cookie('theme', req.query.theme, { maxAge: 900000, httpOnly: true });
			res.locals.theme = req.query.theme;
		}

		res.locals.currentPath = req.path;
		res.locals.NODE_ENV = NODE_ENV;
		res.locals.locale = req.getLocale();

		const lightColors = getColorsObj(req.cookies.light, false);
		const lightShades = generateShades(lightColors, false);
		res.locals.lightVariables = generateVariables(lightShades, false);

		const darkColors = getColorsObj(req.cookies.dark, true);
		const darkShades = generateShades(darkColors, true);
		res.locals.darkVariables = generateVariables(darkShades, true);

		next();
	} catch (error) {
		next(error);
	}
});

// map router to express application
app.use('/', homeRouter);
app.use('/', settingRouter);
app.use('/', themeRouter);

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
