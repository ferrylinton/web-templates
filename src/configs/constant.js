require('dotenv').config();

const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

const PORT = process.env.PORT || '5001';

const BASE_FOLDER =
	NODE_ENV === 'production' ? path.resolve(process.cwd()) : path.resolve(process.cwd(), 'src');

const WEB_TEMPLATE_FOLDER =
	NODE_ENV === 'production'
		? path.join(__dirname, 'webtemplates')
		: path.resolve(process.cwd(), 'src', 'webtemplates');

module.exports = {
	BASE_FOLDER,
	NODE_ENV,
	PORT,
	WEB_TEMPLATE_FOLDER,
};
