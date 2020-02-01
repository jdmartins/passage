const dir = require('./constants')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, args) => {
	return [
		new CopyWebpackPlugin([
			// static files to the site root folder (index and robots)
			{
				from: dir.assets[0],
				to: dir.assets[1],
				toType: 'dir',
				flatten: true
			},
		]),
	]
}