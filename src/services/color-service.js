const chroma = require('chroma-js');

const VARIANTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const sortObjectByKey = unordered => {
	return Object.keys(unordered)
		.sort()
		.reduce((obj, key) => {
			obj[key] = unordered[key];
			return obj;
		}, {});
};

const generateShades = (name, color) => {
	const base = chroma(color).hsl();
	let h = Math.round(base[0] * 100) / 100;
	let s = Math.round(base[1] * 100) / 100;
	const shades = {};

	VARIANTS.forEach(variant => {
		shades[variant] = chroma(h, s, (1000 - variant) / 1000, 'hsl').hex();
	});

	return shades;
};

const generateCssVariables = (shades, isDarkTheme = false) => {
	let result = isDarkTheme ? '.dark{\n' : ':root{\n';

	for (let i in shades) {
		for (let j in shades[i]) {
			result += `\t--${i}-${j}:${shades[i][j]};\n`;
		}
	}

	result += '}';
	return result;
};

module.exports = {
	variants: VARIANTS,
	generateShades,
	sortObjectByKey,
	generateCssVariables,
};
