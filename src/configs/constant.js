require('dotenv').config();

const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || '5001';
const WEB_TEMPLATE_FOLDER =
	NODE_ENV === 'production'
		? path.join(__dirname, 'webtemplates')
		: path.resolve(process.cwd(), 'src', 'webtemplates');

module.exports = {
	NODE_ENV,
	PORT,
	WEB_TEMPLATE_FOLDER,
};
