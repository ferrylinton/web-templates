const path = require('path');
const { create } = require('express-handlebars');
const { BASE_FOLDER } = require('./constant');
const helpers = require('./handlebars-helper');

const VIEWS_FOLDER = path.join(BASE_FOLDER, 'views');

const handlebars = create({
	layoutsDir: VIEWS_FOLDER,
	partialsDir: path.join(VIEWS_FOLDER, 'partials'),
	defaultLayout: 'layout',
	extname: '.hbs',
	helpers,
});

module.exports = function (app) {
	app.engine('.hbs', handlebars.engine);
	app.set('view engine', 'hbs');
	app.set('views', VIEWS_FOLDER);
};
