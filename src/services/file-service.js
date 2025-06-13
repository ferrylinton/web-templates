const { readdirSync, readFileSync } = require('fs');
const path = require('path');
const hljs = require('highlight.js/lib/core');

hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));

const createHighlightedCodeBlock = (content, language) => {
	let lineNumber = 0;
	const highlightedContent = hljs.highlightAuto(content, [language]).value;

	/* Highlight.js wraps comment blocks inside <span class="hljs-comment"></span>.
       However, when the multi-line comment block is broken down into diffirent
       table rows, only the first row, which is appended by the <span> tag, is
       highlighted. The following code fixes it by appending <span> to each line
       of the comment block. */
	const commentPattern = /<span class="hljs-comment">(.|\n)*?<\/span>/g;
	const adaptedHighlightedContent = highlightedContent.replace(commentPattern, data => {
		return data.replace(/\r?\n/g, () => {
			return '\n<span class="hljs-comment">';
		});
	});

	const contentTable = adaptedHighlightedContent
		.split(/\r?\n/)
		.map(lineContent => {
			return `<tr>
              <td class='line-number' data-pseudo-content=${++lineNumber}></td>
              <td>${lineContent}</td>
            </tr>`;
		})
		.join('');

	return `<pre><code><table class='code-table'>${contentTable}</table></code></pre>`;
};

const getWebTemplateFolders = webTemplatePath => {
	const templates = readdirSync(webTemplatePath, { withFileTypes: true })
		.filter(folder => folder.isDirectory())
		.map(folder => {
			const templateName = folder.name;
			const templatePath = path.resolve(webTemplatePath, templateName);

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

		return createHighlightedCodeBlock(fileContent.replace(/\t/g, '  '), language);
		//return hljs.highlight(fileContent, { language }).value;
	} catch (error) {
		return error.message;
	}
};

module.exports = {
	getWebTemplateFolders,
	getFileContent,
};
