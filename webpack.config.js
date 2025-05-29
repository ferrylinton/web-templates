const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = {
	mode: 'development',

	output: {
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},

	resolve: {
		alias: {
			'@src': path.join(__dirname, 'src'),
		},
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: ['css-loader'],
			},
		],
	},
	plugins: [
		new HtmlBundlerPlugin({
			entry: 'src/',
			js: {
				filename: (pathData, assetInfo) => {
					if (pathData.filename && pathData.filename.includes('src')) {
						const arr = pathData.filename.split('src');
						return arr[1].replace('.js', `.${pathData.chunk.hash.substring(0, 8)}.js`);
					} else {
						return `${pathData.chunk.name}.${pathData.chunk.hash.substring(0, 8)}.js`;
					}
				},
			},
			css: {
				filename: (pathData, assetInfo) => {
					console.log(pathData);
					if (pathData.filename && pathData.filename.includes('src')) {
						const arr = pathData.filename.split('src');
						return arr[1].replace(
							'.css',
							`.${pathData.chunk.hash.substring(0, 8)}.css`
						);
					} else {
						return `${pathData.chunk.name}.${pathData.chunk.hash.substring(0, 8)}.css`;
					}
				},
			},
		}),
	],
	devServer: {
		static: path.resolve(__dirname, 'dist'),
		port: 8181,
		watchFiles: {
			paths: ['src/**/*.*'],
			options: {
				usePolling: true,
			},
		},
	},
};
