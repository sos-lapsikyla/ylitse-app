import * as ducks from 'redux-observable';
// import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import * as rx from 'rxjs/operators';

import * as actions from '../actions';
import * as model from '../model';

import { Deps } from '../deps';

export const fetchEpic: ducks.Epic<
  actions.Action,
  any,
  model.AppState,
  Deps
> = (action$, state$, deps) =>
  action$.pipe(
    ducks.ofType<actions.Action, actions.Pick<'FetchCmd'>>('FetchCmd'),
    rx.withLatestFrom(state$),
    rx.mergeMap(([fetchCmd, state]) => {
      const { f, args, onComplete } = fetchCmd;
      const fn: any = deps[f];
      const argsAny: any[] = args(state);
      const onCompleteAny: (arg: any) => actions.Action = onComplete;
      return fn(...argsAny).pipe(rx.map(onCompleteAny));
    }),
  );

export default fetchEpic;
