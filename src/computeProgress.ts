import { Range } from './store/types';

type Timestamp = number;
type Percentage = number;

export enum RangeKind {
	Day,
	Month,
	Quarter,
	Year,
	All
}

const STD_END_TIME = [23, 59, 59];
const STD_START_TIME = [0, 0, 0];

const getTimestamp = (
	yyy?: number,
	m?: number,
	d?: number,
	hh: number = 0,
	mm: number = 0,
	ss: number = 0
) => new Date(yyy, m, d, hh, mm, ss).getTime();

const getDayRange = (d: Date): Range<Timestamp> => {
	const year = d.getFullYear();
	const month = d.getMonth();
	const day = d.getDate();
	// const weekDay = d.getDay();
	// const hour = d.getHours();
	// const isWorkDay = weekDay === 0 || weekDay === 6 ? false : true;
	// const isWorkRange =
	// 	isWorkDay && hour > WORK_START_TIME[0] && hour < WORK_END_TIME[0] ? true : false;
	// if (isWorkRange) {
	// 	return {
	// 		start: getTimestamp(year, month, day, ...WORK_START_TIME),
	// 		end: getTimestamp(year, month, day, ...WORK_END_TIME)
	// 	};
	// } else {
	return {
		start: getTimestamp(year, month, day, ...STD_START_TIME),
		end: getTimestamp(year, month, day, ...STD_END_TIME)
	};
	// }
};

const getMonthRange = (d: Date): Range<Timestamp> => {
	const year = d.getFullYear();
	const month = d.getMonth();

	return {
		start: getTimestamp(year, month, 1, ...STD_START_TIME),
		end: getTimestamp(year, month + 1, 0, ...STD_END_TIME)
	};
};

const getQuarterRange = (d: Date): Range<Timestamp> => {
	const month = d.getMonth();
	const year = d.getFullYear();
	// [startMonth, startDay, endMonth, endDay]
	let params: Array<number>;
	if (month < 3) {
		params = [0, 1, 3, 0];
	} else if (month < 6) {
		params = [2, 1, 6, 0];
	} else if (month < 9) {
		params = [5, 1, 9, 0];
	} else {
		params = [8, 1, 12, 0];
	}

	return {
		start: getTimestamp(year, ...params.slice(0, 2), ...STD_START_TIME),
		end: getTimestamp(year, ...params.slice(2, 4), ...STD_END_TIME)
	};
};

const getYearRange = (d: Date): Range<Timestamp> => {
	const year = d.getFullYear();

	return {
		start: getTimestamp(year, 0, 1, ...STD_START_TIME),
		end: getTimestamp(year, 12, 0, ...STD_END_TIME)
	};
};

function generateRange(d: Date, kind: RangeKind): Range<Timestamp> | Range<Timestamp>[] {
	switch (kind) {
		case RangeKind.Day:
			return getDayRange(d);
		case RangeKind.Month:
			return getMonthRange(d);
		case RangeKind.Quarter:
			return getQuarterRange(d);
		case RangeKind.Year:
			return getYearRange(d);
		case RangeKind.All:
			return [getYearRange(d), getQuarterRange(d), getMonthRange(d), getDayRange(d)];
	}
}

/**
 * Transforms a floating-point into a rounded percentage
 */
const toPercentage = (float: number) => Math.round(float * 100);

function computeProgress(date: Date, kind: RangeKind): Percentage | Percentage[] {
	const formula = (curr: Timestamp, start: Timestamp, end: Timestamp) =>
		(curr - start) / (end - start);

	const getPercentage = (range: Range<Timestamp>) =>
		Math.max(toPercentage(formula(date.getTime(), range.start, range.end)), 0);

	const range = generateRange(date, kind);
	if (!Array.isArray(range)) {
		return getPercentage(range);
	}

	return range.map(range => getPercentage(range));
}

export default computeProgress;
