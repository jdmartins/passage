import { distinctUntilChanged } from 'rxjs/operators'
import { BehaviorSubject } from 'rxjs'
// import storage from '../storage'
import { Range } from './types'

export interface preferences {
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
const defaultpreferences: preferences = {
	selected: DisplayMode.day,
	baseMode: BaseMode.decimal,
	timeMode: TimeMode.elapsed,
	lifespan: { start: new Date(1990, 0, 1), end: new Date(new Date().getFullYear() + 50, 0, 1) }
}

// TODO: Init from db
const init = (): preferences => defaultpreferences

export const preferences$ = new BehaviorSubject<preferences>(init())
export const newPreferences$ = preferences$.pipe(distinctUntilChanged())
