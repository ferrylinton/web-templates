const { statSync, readdirSync, readFileSync, createReadStream, existsSync } = require('fs');
const path = require('path');
const express = require('express');
const archiver = require('archiver');
const { getFileContent } = require('../services/file-service');
const { WEB_TEMPLATE_FOLDER } = require('../configs/constant');

const homeHandler = async (req, res, next) => {
	try {
		res.render('home');
	} catch (error) {
		next(error);
	}
};

const templateViewFileHandler = async (req, res, next) => {
	try {
		const { templateName, folderName, fileName } = req.params;

		const filePath = path.resolve(
			WEB_TEMPLATE_FOLDER,
			templateName,
			folderName || '',
			fileName
		);
		const pathName =
			`/templates/${templateName}/` + (folderName ? `${folderName}/${fileName}` : fileName);

		if (existsSync(filePath)) {
			const fileContent = getFileContent(filePath);
			res.render('detail-file', { templateName, pathName, fileContent });
		} else {
			res.render('detail-file', { templateName, message: 'Template is not found' });
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

		const files = readdirSync(path.resolve(WEB_TEMPLATE_FOLDER, name), { recursive: true });
		for (let i = 0; i < files.length; i++) {
			const filePath = path.resolve(WEB_TEMPLATE_FOLDER, name, files[i]);
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

router.get('/detail/:templateName/:fileName', templateViewFileHandler);

router.get('/detail/:templateName/:folderName/:fileName', templateViewFileHandler);

router.get('/download/:name', templateDownloadHandler);

module.exports = router;
