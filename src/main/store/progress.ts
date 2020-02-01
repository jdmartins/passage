import { map, distinctUntilChanged } from 'rxjs/operators'
import { BehaviorSubject, Observable, timer } from 'rxjs'
import computeProgress from '../computeProgress'

const TIMER_DELAY = 60000

export interface Progress {
  d: number;
  m: number;
  q: number;
  y: number;
}

const init = (): Progress => {
	// TODO: unify returning interface
	const [y, q, m, d] = computeProgress(new Date())
	return { d, m, q, y }
}
// let i = 0;
export const progress$ = new BehaviorSubject<Progress>(init())
export const newProgress$: Observable<Progress> = timer(0, TIMER_DELAY).pipe(
	map(i => computeProgress(new Date()) as number[]),
	map(([y, q, m, d]) => ({ y, q, m, d })),
	distinctUntilChanged((x, y) => x.d === y.d && x.m === y.m && x.q === y.q && x.y === y.y)
)

export function runTimer() {
	newProgress$.subscribe(s => {
		progress$.next(s)
	})
}
