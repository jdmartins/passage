import { BehaviorSubject } from 'rxjs';
import storage from '../storage';
import { Range } from './types';

export interface Settings {
	timeMode: TimeMode;
	baseMode: BaseMode;
	selected: DisplayMode;
	lifespan: Range<Date>;
	//TODO: ability to change day start and end
	// dayStartTime = [8, 0, 0];
}

export enum DisplayMode {
	day,
	month,
	quarter,
	year,
	life
}

export enum TimeMode {
	elapsed,
	remaining
}

export enum BaseMode {
	decimal,
	binary
}

// Used in case there is nothing on the db
const defaultSettings: Settings = {
	selected: DisplayMode.day,
	baseMode: BaseMode.decimal,
	timeMode: TimeMode.elapsed,
	lifespan: { start: new Date(1990, 0, 1), end: new Date(new Date().getFullYear() + 50, 0, 1) }
};

// TODO: Init from db
const init = (): Settings => defaultSettings;

export const settings$ = new BehaviorSubject<Settings>(init());
