const express = require('express');
const {
	generateShades,
	variants,
	generateVariables,
	getColorsObj,
} = require('../services/theme-service');
const { highlightCss } = require('../services/file-service');

const themeHandler = async (req, res, next) => {
	try {
		const isDark = req.params.name === 'dark';
		const colors = getColorsObj(isDark ? req.cookies.dark : req.cookies.light, isDark);
		const shades = generateShades(colors, isDark);
		const variables = generateVariables(shades, isDark);
		const formattedVariables = highlightCss(variables);

		res.render('theme', { variants, colors, shades, variables, formattedVariables });
	} catch (error) {
		next(error);
	}
};

const router = express.Router();

router.get('/theme/:name', themeHandler);

module.exports = router;
