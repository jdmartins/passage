import {
	app,
	Tray,
	Menu,
	MenuItem,
	nativeImage,
	MenuItemConstructorOptions,
	BrowserWindow,
	screen
} from 'electron';
import { Subject, BehaviorSubject } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { store } from './store';
import { Progress } from './store/progress';
import { settings$, DisplayMode } from './store/Settings';

import { runTimer } from './timer';
import { capitalize } from './utils';
let tray: Electron.Tray;
const { progress$ } = store;

const getScaleFactor = () => {
	return screen.getPrimaryDisplay().scaleFactor;
};

const getProgressImage = (p: number) =>
	nativeImage.createFromPath(`${__dirname}/../assets/progress_${p}@${getScaleFactor()}x.png`);

app.on('ready', () => {
	const ctxMenu$ = new Subject<Menu>();
	const isOpen$ = new BehaviorSubject<boolean>(false);

	const getCtxMenu = (p: Progress) => {
		return Menu.buildFromTemplate(getNewMenuItems(p));
	};

	const updateDisplay = (selected: DisplayMode) => {
		const getSelected = (): string[] => {
			switch (selected) {
				case DisplayMode.day:
					return ['day', 'd'];
				case DisplayMode.month:
					return ['month', 'm'];
				case DisplayMode.quarter:
					return ['quarter', 'q'];
				case DisplayMode.year:
					return ['year', 'y'];
			}
		};

		const key = getSelected()[1];
		const progress = progress$.getValue()[key as keyof Progress];
		tray.setToolTip(`Passage\nShowing ${getSelected()[0]} progress`);
		tray.setImage(getProgressImage(progress));
		tray.setTitle(` ${capitalize(getSelected()[0])}: ${progress}%`);
	};

	const getNewMenuItems = ({ d, m, q, y }: Progress): Array<MenuItemConstructorOptions> => {
		const isChecked = (mode: DisplayMode) => mode === settings$.getValue().selected;
		const handleClick = (menuItem: MenuItem, bw: BrowserWindow, ev: KeyboardEvent) => {
			const newSelected = Number(menuItem.id);
			settings$.next({ ...settings$.getValue(), selected: newSelected });
		};

		return [
			{
				id: DisplayMode.day.toString(),
				icon: getProgressImage(d),
				label: `Day: ${d}%`,
				type: 'radio',
				checked: isChecked(DisplayMode.day),
				click: handleClick
			},
			{
				id: DisplayMode.month.toString(),
				icon: getProgressImage(m),
				label: `Month: ${m}%`,
				type: 'radio',
				checked: isChecked(DisplayMode.month),
				click: handleClick
			},
			{
				id: DisplayMode.quarter.toString(),
				icon: getProgressImage(q),
				label: `Quarter: ${q}%`,
				type: 'radio',
				checked: isChecked(DisplayMode.quarter),
				click: handleClick
			},
			{
				id: DisplayMode.year.toString(),
				icon: getProgressImage(y),
				label: `Year: ${y}%`,
				type: 'radio',
				checked: isChecked(DisplayMode.year),
				click: handleClick
			},
			{
				id: DisplayMode.day.toString(),
				icon: getProgressImage(d),
				label: 'bla',
				type: 'normal'
			}
		];
	};

	tray = new Tray(getProgressImage(progress$.getValue().y));
	tray.setToolTip(`Passage\nShowing year progress`);
	store.progress$.forEach(progress => {
		//TODO: set based on the selected preference
		updateDisplay(settings$.getValue().selected);

		ctxMenu$.next(getCtxMenu(progress));
	});

	// FIXME: electron `setContextMenu` destroys reference to previous menu,
	// which leads the menu to close itself https://github.com/electron/electron/issues/10951
	// also updating the menuItems e.g `menu.items[0].label = <arbitraryValue>` does not work
	ctxMenu$.pipe(filter(() => !isOpen$.getValue())).subscribe(menu => tray.setContextMenu(menu));

	ctxMenu$.forEach(menu => {
		menu.on('menu-will-show', () => isOpen$.next(true));
		menu.on('menu-will-close', () => isOpen$.next(false));
	});

	const newSettings$ = settings$.pipe(distinctUntilChanged());

	newSettings$.subscribe(({ selected }) => updateDisplay(selected));

	runTimer();
});
