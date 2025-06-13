const app = require('./app');
const { NODE_ENV, PORT } = require('./configs/constant');

(function () {
	try {
		app.listen(PORT, '0.0.0.0', () => {
			console.log('[SERVER] NODE_ENV : ', NODE_ENV);
			console.log(`[SERVER] Server is running at 'http://127.0.0.1:${PORT}'`);
		});
	} catch (error) {
		//The application will stop if there is an error
		console.log(error);
		process.exit();
	}
})();
