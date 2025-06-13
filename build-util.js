const fs = require('fs-extra');
const childProcess = require('child_process');

function copy(src, dest) {
	return new Promise((res, rej) => {
		return fs.copy(src, dest, err => {
			return !!err ? rej(err) : res();
		});
	});
}

function exec(cmd, loc) {
	return new Promise((res, rej) => {
		return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
			if (!!stdout) {
				console.log(stdout);
			}
			if (!!stderr) {
				console.log(stderr);
			}
			return !!err ? rej(err) : res();
		});
	});
}

async function run() {
	await copy('./package.json', './dist/package.json');
	await exec('npm pkg delete devDependencies', './dist');
	await exec('npm pkg delete simple-git-hooks', './dist');
	await exec('npm pkg delete scripts', './dist');
	await exec(
		'npm pkg set scripts.start="cross-env NODE_ENV=production node server.js"',
		'./dist'
	);
	await copy('./.env', './dist/.env');
}

run()
	.then(() => {
		console.log('build-util is run successfully...');
	})
	.catch(error => {
		console.log('build-util is error ...');
		console.error(error);
	});
