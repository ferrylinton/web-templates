const path = require('path');
const express = require('express');
const favicon = require('express-favicon');
const { create } = require('express-handlebars');
const homeRouter = require('./routers/home-router');
const { WEB_TEMPLATE_PATH } = require('./configs/constant');
const { getWebTemplateFolders, getDirTree } = require('./services/file-service');

const VIEWS_FOLDER = path.join(__dirname, 'views');

// Handlebars engine config
const handlebars = create({
	layoutsDir: VIEWS_FOLDER,
	partialsDir: path.join(VIEWS_FOLDER, 'partials'),
	defaultLayout: 'layout',
	extname: '.hbs',
	helpers: {
		add: function (num1, num2) {
			return num1 + num2;
		},

		templates: function (options) {
			options.data.root['templates'] = getWebTemplateFolders();
		},

		tree: function (options) {
			options.data.root['tree'] = getDirTree();
		},
	},
});

/**
 * Creates an Express application
 */
const app = express();

app.set('trust proxy', 1);
app.use(favicon(path.join(__dirname, 'favicon.ico')));

// set assets url
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/templates', express.static(WEB_TEMPLATE_PATH));

// Handlebars config
app.engine('.hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.set('views', VIEWS_FOLDER);

// parses incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
