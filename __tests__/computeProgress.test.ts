import test from 'ava';

import computeProgress, { RangeKind } from '../src/computeProgress';

test('should return array with all progress metrics', t => {
	const progress = computeProgress(new Date(2019, 12, 0, 23, 59, 59), RangeKind.All) as number[];
	const [yearP, quarterP, monthP, dayP] = progress;

	t.is(progress.length, 4);
	t.is(yearP, 100);
	t.is(quarterP, 100);
	t.is(monthP, 100);
	t.is(dayP, 100);
});

test('should return correct year progress', t => {
	const data = [
		{ d: new Date(2019, 0, 1, 0, 0, 0), e: 0 },
		{ d: new Date(2019, 3, 1, 0, 0, 0), e: 25 },
		{ d: new Date(2019, 6, 1, 0, 0, 0), e: 50 },
		{ d: new Date(2019, 12, 0, 23, 59, 59), e: 100 }
	];

	let c = (d: Date) => computeProgress(d, RangeKind.Year);
	data.map(f => t.is(c(f.d), f.e, f.d.toDateString()));
});

test('should return correct quarter progress', t => {
	const data = [
		{ d: new Date(2019, 0, 1, 0, 0, 0), e: 0 },
		{ d: new Date(2019, 2, 31, 0, 0, 0), e: 99 },
		{ d: new Date(2019, 6, 1, 0, 0, 0), e: 25 },
		{ d: new Date(2019, 11, 0, 0, 0, 0), e: 74 }
	];

	let c = (d: Date) => computeProgress(d, RangeKind.Quarter);
	data.map(f => t.is(c(f.d), f.e, f.d.toDateString()));
});

test('should return correct month progress', t => {
	const data = [
		{ d: new Date(2019, 0, 1, 16, 0, 0), e: 2 },
		{ d: new Date(2019, 2, 31, 23, 59, 59), e: 100 },
		{ d: new Date(2019, 5, 16, 0, 0, 0), e: 50 },
		{ d: new Date(2019, 11, 0, 20, 0, 0), e: 99 }
	];

	let c = (d: Date) => computeProgress(d, RangeKind.Month);
	data.map(f => t.is(c(f.d), f.e, f.d.toDateString()));
});

test('should return correct day progress', t => {
	const data = [
		{ d: new Date(2019, 0, 1, 20, 0, 0), e: 83 },
		{ d: new Date(2019, 2, 31, 23, 59, 59), e: 100 },
		{ d: new Date(2019, 5, 16, 9, 0, 0), e: 38 },
		{ d: new Date(2019, 11, 0, 12, 0, 0), e: 50 }
	];

	let c = (d: Date) => computeProgress(d, RangeKind.Day);
	data.map(f => t.is(c(f.d), f.e, f.d.toDateString()));
});
