const express = require('express');
const { generateShades, variants, generateCssVariables } = require('../services/color-service');
const { highlightCss } = require('../services/file-service');

const settingHandler = async (req, res, next) => {
	try {
		const light = {
			base: generateShades('base', '#6c757d'),
			primary: generateShades('primary', '#0d6efd'),
			danger: generateShades('danger', '#dc3545'),
			success: generateShades('danger', '#198754'),
			accent: generateShades('danger', '#fd7e14'),
		};

		const lightVariables = generateCssVariables(light);
		const formattedLightVariables = highlightCss(lightVariables);
		res.render('setting', { variants, light, lightVariables, formattedLightVariables });
	} catch (error) {
		next(error);
	}
};

const router = express.Router();

router.get('/setting', settingHandler);

module.exports = router;
