const dir = require('./constants')
const plugins = require('./webpack.plugins')

module.exports = (env, args) => {
	let production = false

	if (args && args.mode === 'production') {
		production = true
		console.log('== Production mode')
	} else {
		console.log('== Development mode')
	}

	return {
		entry: {
			'scripts/main': dir.entry,
		},
		output: {
			path: dir.out,
			filename: 'bundle.js',

		},
		target: 'electron-renderer',
		devtool: production ? false : 'source-map',
		optimization: {
			splitChunks: {
				// always create vendor.js
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'scripts/vendor',
						chunks: 'initial',
						enforce: true,
					},
				},
			},
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js'],
			alias: {
				react: 'preact/compat',
				'react-dom/test-utils': 'preact/test-utils',
				'react-dom': 'preact/compat',
				// Must be below test-utils
			},
		},
		module: {
			rules: [
				{
					test: /\.(js|tsx?)$/,
					exclude: /node_modules/,
					use: {
						loader: 'ts-loader',
					},
				},

			],
		},
		devServer: {
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			contentBase: dir.out,
			compress: true,
			port: 3030,
		},
		plugins: plugins(env, args)
	}
}