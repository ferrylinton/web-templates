const chroma = require('chroma-js');
const validate = require('jsonschema').validate;

const colorSchema = {
	id: '/color',
	type: 'object',
	additionalProperties: false,
	properties: {
		base: { type: 'string' },
		primary: { type: 'string' },
		danger: { type: 'string' },
		success: { type: 'string' },
		accent: { type: 'string' },
	},
	required: ['base', 'primary', 'danger', 'success', 'accent'],
};

const VARIANTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const LIGHT = {
	base: '#6c757d',
	primary: '#0d6efd',
	danger: '#dc3545',
	success: '#198754',
	accent: '#fd7e14',
};

const DARK = {
	base: '#6c757d',
	primary: '#0d6efd',
	danger: '#dc3545',
	success: '#198754',
	accent: '#fd7e14',
};

const sortObjectByKey = unordered => {
	return Object.keys(unordered)
		.sort()
		.reduce((obj, key) => {
			obj[key] = unordered[key];
			return obj;
		}, {});
};

const getColorsObj = (colorsStr, isDark) => {
	try {
		if (!colorsStr) {
			return isDark ? DARK : LIGHT;
		}

		const obj = JSON.parse(colorsStr);
		const result = validate(obj, colorSchema);

		if (result.valid) {
			return obj;
		} else {
			return LIGHT;
		}
	} catch (e) {
		console.error(e);
		return LIGHT;
	}
};

const generateShades = (colors, isDark) => {
	const shades = {};

	for (const key in colors) {
		const color = colors[key];
		const base = chroma(color).hsl();
		let h = Math.round(base[0] * 100) / 100;
		let s = Math.round(base[1] * 100) / 100;

		shades[key] = {};
		VARIANTS.forEach(variant => {
			const l = (1000 - variant) / 1000;
			const hsl = chroma(h, s, l, 'hsl').css('hsl');
			shades[key][variant] = hsl.replace('hsl(', '').replace(')', '').replaceAll(' ', ', ');
		});
	}

	return shades;
};

const generateVariables = (shades, isDark) => {
	let result = isDark ? '.dark{\n' : ':root{\n';

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
	generateVariables,
	getColorsObj,
};
