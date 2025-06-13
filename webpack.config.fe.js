const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (_env, argv) => {
	const isProduction = argv.mode === 'production';

	return {
		target: 'web',

		entry: {
			all: [
				path.resolve(__dirname, 'src', 'assets', 'js', 'main.js'),
				path.resolve(__dirname, 'src', 'assets', 'css', 'index.css'),
			],
		},

		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: isProduction ? 'assets/js/[name].[contenthash].js' : 'assets/js/[name].js',
			publicPath: '/',
			clean: false,
		},

		module: {
			rules: [
				{
					test: /\.css$/,
					exclude: [/webtemplates/],
					use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
				},
				{
					test: /[\\/]image[\\/].+(png|jpe?g|svg|webp|ico)$/,
					type: 'asset/resource',
					generator: {
						filename: 'assets/image/[name].[hash:8][ext]',
					},
				},
				{
					test: /favicon.ico/,
					type: 'asset/resource',
					generator: {
						filename: 'favicon.ico',
					},
				},
				{
					test: /\.(png|jpe?g|ico|svg)$/,
					type: 'asset/resource',
				},
			],
		},

		optimization: {
			minimizer: [
				new CssMinimizerPlugin({
					exclude: /webtemplates/,
				}),
				'...',
			],
		},

		plugins: [
			new CopyPlugin({
				patterns: [
					{
						from: path.resolve(__dirname, 'src', 'assets'),
						to: path.resolve(__dirname, 'dist', 'assets'),
					},
					{
						from: path.resolve(__dirname, 'src', 'views'),
						to: path.resolve(__dirname, 'dist', 'views'),
						globOptions: {
							dot: true,
							gitignore: true,
							ignore: ['**/layout.hbs'],
						},
					},
					{
						from: path.resolve(__dirname, 'src', 'webtemplates'),
						to: path.resolve(__dirname, 'dist', 'webtemplates'),
					},
					{
						from: path.resolve(__dirname, 'src', 'favicon.ico'),
						to: path.resolve(__dirname, 'dist'),
					},
				],
			}),
			new MiniCssExtractPlugin({
				filename: isProduction
					? 'assets/css/all.[contenthash].css'
					: 'assets/css/[name].css',
				chunkFilename: isProduction
					? 'assets/css/all.[contenthash].css'
					: 'assets/css/[id].css',
			}),
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, 'src', 'views', 'layout.hbs'),
				filename: path.resolve(__dirname, 'dist', 'views', 'layout.hbs'),
				hash: false,
				minify: false,
				inject: false,
			}),
		],

		devtool: isProduction ? 'source-map' : 'inline-source-map',
	};
};
