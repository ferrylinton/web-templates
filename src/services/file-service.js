const { readdirSync, readFileSync } = require('fs');
const path = require('path');
const hljs = require('highlight.js/lib/core');

hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));

const { WEB_TEMPLATE_PATH } = require('../configs/constant');

const getWebTemplateFolders = () => {
	const templates = readdirSync(WEB_TEMPLATE_PATH, { withFileTypes: true })
		.filter(folder => folder.isDirectory())
		.map(folder => {
			const templateName = folder.name;
			const templatePath = path.resolve(WEB_TEMPLATE_PATH, templateName);

			const files = readdirSync(templatePath, { withFileTypes: true, recursive: true })
				.filter(file => file.isFile())
				.map(file => {
					const relativePath =
						file.parentPath.replace(templatePath, '').replaceAll('\\', '/') +
						'/' +
						file.name;
					return {
						fileName: file.name,
						relativePath,
					};
				});

			return {
				templateName,
				templatePath,
				files,
			};
		});
	return templates;
};

const getFileContent = filePath => {
	try {
		const fileContent = readFileSync(filePath).toString();
		let language = path.extname(filePath).replace('\.', '');
		language = language === 'html' ? 'xml' : language;

		return hljs.highlight(fileContent, { language }).value;
	} catch (error) {
		return error.message;
	}
};

module.exports = {
	getWebTemplateFolders,
	getFileContent,
};
