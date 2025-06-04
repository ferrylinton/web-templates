require('dotenv').config();

const path = require('path');

module.exports = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || '5001',
	WEB_TEMPLATE_PATH: path.resolve(process.cwd(), 'src', 'web-templates'),
};
