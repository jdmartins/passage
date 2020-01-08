import { BehaviorSubject } from 'rxjs';
import computeProgress, { RangeKind } from '../computeProgress';
export interface Progress {
	d: number;
	m: number;
	q: number;
	y: number;
}

const init = (): Progress => {
	const [y, q, m, d] = computeProgress(new Date(), RangeKind.All);
	return { d, m, q, y };
};

export const progress$ = new BehaviorSubject<Progress>(init());
