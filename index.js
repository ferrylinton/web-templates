const app = require('./src/app');
const { NODE_ENV, PORT } = require('./src/configs/constant');

console.log(NODE_ENV);

(function () {
	try {
		app.listen(PORT, '0.0.0.0', () => {
			console.log(`[SERVER] Server is running at 'http://127.0.0.1:${PORT}'`);
		});
	} catch (error) {
		//The application will stop if there is an error
		console.log(error);
		process.exit();
	}
})();
