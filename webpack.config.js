// const path = require('path')
// const CopyPlugin = require('copy-webpack-plugin')
// const srcDir = path.join(__dirname, 'src')
// const outputDir = path.join(__dirname, 'dist')

// module.exports = {
// 	entry: path.join(__dirname, 'src', 'main.ts'),
// 	output: {
// 		path: outputDir,
// 		filename: 'bundle.js',
// 	},
// 	module: {
// 		rules: [
// 			{
// 				test: /\.(js|ts)$/,
// 				exclude: /node_modules/,
// 				use: {
// 					loader: 'ts-loader',
// 				},
// 			},
// 		],
// 	},
// 	plugins: [
// 		new CopyPlugin([
// 			{ from: path.join(__dirname, 'assets/*'), to: outputDir },
// 			{ from: path.join(srcDir, 'preferences.html'), to: outputDir },
// 		]),
// 	],
// 	resolve: {
// 		extensions: ['.ts', '.js'],
// 		alias: {
// 			react: 'preact/compat',
// 			'react-dom/test-utils': 'preact/test-utils',
// 			'react-dom': 'preact/compat',
// 			// Must be below test-utils
// 		},
// 	},
// 	devServer: {
// 		port: 3000,
// 		open: true,
// 	},
// 	target: 'electron-renderer',
// }
