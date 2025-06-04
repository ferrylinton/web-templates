const express = require('express');
const archiver = require('archiver');
const fs = require('fs');
const { readdirSync } = require('fs');
const path = require('path');
const { WEB_TEMPLATE_PATH } = require('../configs/constant');

const homeHandler = async (req, res, next) => {
	try {
		const folders = readdirSync(WEB_TEMPLATE_PATH, { withFileTypes: true })
			.filter(folder => folder.isDirectory())
			.map(folder => folder.name);

		res.render('home', { folders });
	} catch (error) {
		next(error);
	}
};

const templateViewHandler = async (req, res, next) => {
	try {
		var selected = null;
		const name = req.params.name;

		const folders = readdirSync(WEB_TEMPLATE_PATH, { withFileTypes: true })
			.filter(folder => folder.isDirectory())
			.map(folder => folder.name);

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

		res.render('detail', { folders, files, first, last, selected, name });
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
			const stats = fs.statSync(filePath);

			if (stats.isFile()) {
				const fileName = files[i];
				archive.append(fs.createReadStream(filePath), { name: fileName });
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

router.get('/download/:name', templateDownloadHandler);

module.exports = router;
