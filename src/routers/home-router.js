const { statSync, readdirSync, readFileSync, createReadStream, existsSync } = require('fs');
const path = require('path');
const express = require('express');
const archiver = require('archiver');
const { WEB_TEMPLATE_PATH } = require('../configs/constant');
const { getFileContent } = require('../services/file-service');

const homeHandler = async (req, res, next) => {
	try {
		res.render('home');
	} catch (error) {
		next(error);
	}
};

const templateViewFileHandler = async (req, res, next) => {
	try {
		let selected = null;

		const { templateName, folderName, fileName } = req.params;

		const filePath = path.resolve(WEB_TEMPLATE_PATH, templateName, folderName || '', fileName);
		const pathName =
			`/templates/${templateName}/` + (folderName ? `${folderName}/${fileName}` : fileName);
		console.log(filePath);
		console.log(pathName);

		if (existsSync(filePath)) {
			const fileContent = getFileContent(filePath);
			res.render('detail-file', { pathName, fileContent });
		} else {
			res.render('detail-file', { message: 'Template is not found' });
		}
	} catch (error) {
		next(error);
	}
};

const templateViewHandler = async (req, res, next) => {
	try {
		let selected = null;
		const name = req.params.name;
		console.log(name);

		if (existsSync(path.resolve(WEB_TEMPLATE_PATH, name))) {
			const filesByName = readdirSync(path.resolve(WEB_TEMPLATE_PATH, name)).filter(file =>
				file.match(/.*\.(html?)/gi)
			);

			const files = filesByName.map((file, index) => {
				if (file === 'index.html') {
					selected = {
						url: `/templates/${name}/${file}`,
						index,
					};
				}

				return {
					url: `/templates/${name}/${file}`,
					index,
				};
			});

			const first = files[0];
			const last = files[files.length - 1];

			if (selected === null) {
				selected = files[0];
			}

			res.render('detail', { files, first, last, selected, name });
		} else {
			res.render('detail', { message: 'Template is not found', name });
		}
	} catch (error) {
		next(error);
	}
};

const templateDownloadHandler = async (req, res, next) => {
	try {
		const name = req.params.name;

		res.attachment(`${name}.zip`);
		res.setHeader('Content-Type', 'application/zip');

		// Create an archiver instance
		const archive = archiver('zip', {
			zlib: { level: 9 }, // Sets the compression level
		});

		// Handle errors during archiving
		archive.on('error', err => {
			console.error('Archiving error:', err);
			res.status(500).send('Error creating zip file.');
		});

		// Handle archive finish
		archive.on('end', () => {
			console.log('Archive finalized. Total bytes:', archive.pointer());
		});

		// Pipe the archive to the response
		archive.pipe(res);

		const files = readdirSync(path.resolve(WEB_TEMPLATE_PATH, name), { recursive: true });
		for (let i = 0; i < files.length; i++) {
			const filePath = path.resolve(WEB_TEMPLATE_PATH, name, files[i]);
			const stats = statSync(filePath);

			if (stats.isFile()) {
				const fileName = files[i];
				archive.append(createReadStream(filePath), { name: fileName });
			}
		}

		// Finalize the archive (important to signal the end of the archive)
		archive.finalize();
	} catch (error) {
		next(error);
	}
};

/**
 * Create instance of Express.Router
 */
const router = express.Router();

router.get('/', homeHandler);

router.get('/detail/:name', templateViewHandler);

router.get('/detail/:templateName/:fileName', templateViewFileHandler);

router.get('/detail/:templateName/:folderName/:fileName', templateViewFileHandler);

router.get('/download/:name', templateDownloadHandler);

module.exports = router;
