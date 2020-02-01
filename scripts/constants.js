const path = require('path')
const root = path.resolve(__dirname, '../')

const dir = {
	src: path.join(root, 'src'),
	entry: path.join(root, 'src', 'renderer', 'preferences.tsx'),
	assets: [path.join(root, 'src', 'static','**', '*'), path.join(root, 'dist', 'static')],
	out:  path.join(root, 'dist'),
}

module.exports = dir