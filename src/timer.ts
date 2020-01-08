import { timer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import computeProgress, { RangeKind } from './computeProgress';
import { store } from './store';
// import { Progress } from './store/progress';
const TIMER_DELAY = 60000;

export function runTimer() {
	const source$: Observable<number[]> = timer(0, TIMER_DELAY).pipe(
		map(() => computeProgress(new Date(), RangeKind.All) as number[])
	);

	source$.subscribe(([y, q, m, d]) => {
		store.progress$.next({ y, q, m, d });
	});
}
