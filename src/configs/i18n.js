const i18n = require('i18n');
const path = require('path');
const { BASE_FOLDER } = require('./constant');

i18n.configure({
	locales: ['id', 'en'],
	defaultLocale: 'id',

	// change 'accept-language' because browser always send 'accept-language'
	// Accept-Language: en-US,en;q=0.9 , depend on your browser setting
	header: 'x-accept-language',
	queryParameter: 'lang',
	cookie: 'locale',

	directory: path.join(BASE_FOLDER, 'locales'),
	autoReload: true,
	updateFiles: false,
	syncFiles: false,
});

module.exports = function (app) {
	// default: using 'accept-language' header to guess language settings
	app.use(i18n.init);

	app.use((req, res, next) => {
		if (req.cookies.locale === undefined) {
			res.cookie('locale', req.getLocale(), { maxAge: 900000, httpOnly: true });
		}

		if (req.query.lang) {
			i18n.setLocale(req.query.lang);
			res.cookie('locale', req.getLocale(), { maxAge: 900000, httpOnly: true });
		}

		next();
	});
};
