const { getWebTemplateFolders } = require('../services/file-service');
const { NODE_ENV } = require('./constant');
const i18n = require('i18n');

module.exports = {
	add: function (num1, num2) {
		return num1 + num2;
	},

	setVar: function (varName, varValue, options) {
		options.data.root[varName] = varValue;
	},

	concat: function () {
		var outStr = '';
		for (var arg in arguments) {
			if (typeof arguments[arg] != 'object') {
				outStr += arguments[arg];
			}
		}
		return outStr;
	},

	isProduction: function () {
		return NODE_ENV === 'production';
	},

	eqPathClass: function (arg1, arg2) {
		return arg1 === arg2 ? 'active' : '';
	},

	eqPathChecked: function (arg1, arg2) {
		return arg1 === arg2 ? 'checked' : '';
	},

	templates: function (options) {
		options.data.root['templates'] = getWebTemplateFolders();
	},

	eq: function (str1, str2) {
		return str1 === str2;
	},

	t: function (str) {
		if (!str) return str;
		return i18n.__(str);
	},
};
