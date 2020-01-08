const path = require('path');
const outputDirectory = 'dist';

module.exports = {
	entry: path.join(__dirname, 'src', 'main.ts'),
	output: {
		path: path.join(__dirname, outputDirectory),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.(js|ts)$/,
				exclude: /node_modules/,
				use: {
					loader: 'ts-loader'
				}
			},
			{
				test: /\.(png|woff|woff2|eot|ttf)$/,
				loader: 'url-loader?limit=100000'
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	devServer: {
		port: 3000,
		open: true
	},
	target: 'electron-renderer'
};
