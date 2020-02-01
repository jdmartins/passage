import { filter } from 'rxjs/operators'
import { BehaviorSubject, Subject } from 'rxjs'
import {
	MenuItemConstructorOptions,
	BrowserWindow,
	MenuItem,
	nativeImage,
	KeyboardEvent,
	screen,
	Tray,
	Menu
} from 'electron'
import { Progress, progress$, newProgress$ } from './store/progress'
import { DisplayMode, preferences$, newPreferences$ } from './store/preferences'
import { capitalize } from './utils'
import path from 'path'
import { mainWindow } from './main'

declare var __static: string

const getScaleFactor = () => {
	const displays = screen.getAllDisplays()
	return displays.reduce((acc, { scaleFactor }) => Math.max(acc, scaleFactor), 1)
}

const getProgressImage = (p: number) => {

	const getSuffix = () =>
		getScaleFactor() > 3 ? `@${3}x` : getScaleFactor() === 1 ? '' : `@${getScaleFactor()}x`
	return nativeImage.createFromPath(path.join(__static, `progress_${p}${getSuffix()}.png`)) // eslint-disable-line 
}
export default class MenuTray {
private tray: Tray;
public ctxMenu$ = new Subject<Menu>();
private isOpen$ = new BehaviorSubject<boolean>(false);
constructor() {
// TODO: get settings first then set
	this.tray = new Tray(getProgressImage(progress$.getValue().d))

	// FIXME: electron `setContextMenu` destroys reference to previous menu,
	// which leads the menu to close itself https://github.com/electron/electron/issues/10951
	// also updating the menuItems e.g `menu.items[0].label = <arbitraryValue>` does not work
	this.ctxMenu$
		.pipe(filter(() => !this.isOpen$.getValue()))
		.subscribe(menu => this.tray.setContextMenu(menu))

	this.ctxMenu$.forEach(menu => {
		menu.on('menu-will-show', () => this.isOpen$.next(true))
		menu.on('menu-will-close', () => this.isOpen$.next(false))
	})

	newProgress$.subscribe(p => {
		this.updateDisplayMode(preferences$.getValue().selected, p)
		this.ctxMenu$.next(this.getCtxMenu(p))
	})

	newPreferences$.subscribe(p => this.updateDisplayMode(p.selected, progress$.getValue()))
}

private getNewMenuItems({ d, m, q, y }: Progress): Array<MenuItemConstructorOptions> {
// const isChecked = (mode: DisplayMode) => mode === preferences$.getValue().selected;
	const handleClick = (menuItem: MenuItem, bw: BrowserWindow, ev: KeyboardEvent) => {
		const newSelected = Number(menuItem.id)
		preferences$.next({ ...preferences$.getValue(), selected: newSelected })
	}

	return [
		{
			id: DisplayMode.day.toString(),
			icon: getProgressImage(d),
			label: `Day: ${d}%`,
			type: 'radio',
			click: handleClick
		},
		{
			id: DisplayMode.month.toString(),
			icon: getProgressImage(m),
			label: `Month: ${m}%`,
			type: 'radio',
			click: handleClick
		},
		{
			id: DisplayMode.quarter.toString(),
			icon: getProgressImage(q),
			label: `Quarter: ${q}%`,
			type: 'radio',
			click: handleClick
		},
		{
			id: DisplayMode.year.toString(),
			icon: getProgressImage(y),
			label: `Year: ${y}%`,
			type: 'radio',
			click: handleClick
		},
		{
			type: 'separator'
		},
		{
			label: 'Preferences',
			type: 'normal',
			click: () => mainWindow!.show(),
		},
		{
			type: 'separator'
		},
		{
			label: 'Quit',
			type: 'normal'
		}
	]
}

public updateDisplayMode(selected: DisplayMode, progress: Progress) {
	const getSelected = (): string[] => {
		switch (selected) {
			case DisplayMode.day:
				return ['day', 'd']
			case DisplayMode.month:
				return ['month', 'm']
			case DisplayMode.quarter:
				return ['quarter', 'q']
			case DisplayMode.year:
				return ['year', 'y']
			default:
				return ['day', 'd']
		}
	}
	const key = getSelected()[1]
	const p = progress[key as keyof Progress]
	this.tray.setToolTip(`Passage\nShowing ${getSelected()[0]} progress`)
	this.tray.setTitle(` ${capitalize(getSelected()[0])}: ${p}%`)
	this.tray.setImage(getProgressImage(p))
}

public getCtxMenu(p: Progress): Menu {
	return Menu.buildFromTemplate(this.getNewMenuItems(p))
}
}
