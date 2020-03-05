import * as ducks from 'redux-observable';
import { pipe } from 'fp-ts/lib/pipeable';
import * as rx from 'rxjs/operators';

import * as actions from '../actions';
import * as model from '../model';

import { Deps } from '../deps';

export const fetchEpic: ducks.Epic<
  actions.Action,
  any,
  model.AppState,
  Deps
> = (action$, state$) =>
  pipe(
    action$,
    ducks.ofType<actions.Action, actions.Pick<'FetchCmd'>>('FetchCmd'),
    rx.withLatestFrom(state$),
    rx.mergeMap(([{ f }, state]) => f(state)),
  );

export default fetchEpic;
