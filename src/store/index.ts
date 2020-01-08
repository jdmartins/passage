import { BehaviorSubject } from 'rxjs';
import { Progress, progress$ } from './progress';
import { Settings, settings$ } from './settings';

export interface State {
	progress$: BehaviorSubject<Progress>;
	settings$: BehaviorSubject<Settings>;
}

export const store: State = {
	progress$,
	settings$
};
