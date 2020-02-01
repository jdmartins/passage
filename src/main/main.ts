import  path from 'path'
import { app, BrowserWindow, Event } from 'electron'
import { format as formatUrl } from 'url'
import { runTimer } from './store/progress'
import MenuTray from './MenuTray'

// eslint-disable-next-line no-unused-vars
export let mainWindow: BrowserWindow | null
const isDevelopment = process.env.NODE_ENV !== 'production'

app.on('ready', () => {
	new MenuTray()
	mainWindow = createMainWindow()

	runTimer()
})

function createMainWindow() {
	const window =  new BrowserWindow({
		title: 'Preferences',
		width: 640,
		height: 480,
		show: false,
		resizable: false,
		minimizable: false,
		maximizable: false,
		alwaysOnTop: true,
		webPreferences: {nodeIntegration:true}
	})
  
	if (isDevelopment) {
		window.webContents.openDevTools()
		window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
	} else {
		window.loadURL(formatUrl({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file',
			slashes: true
		}))
	}

	window.on('close', (e: Event) => {
		e.preventDefault()
		mainWindow!.hide()
	})

	window.webContents.on('devtools-opened', () => {
		window.focus()
		setImmediate(() => {
			window.focus()
		})
	})

	return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
	// on macOS it is common for applications to stay open until the user explicitly quits
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
