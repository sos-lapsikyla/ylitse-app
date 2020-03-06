import * as ducks from 'redux-observable';
import { pipe } from 'fp-ts/lib/pipeable';
import * as rx from 'rxjs/operators';

import * as actions from '../actions';
import * as model from '../model';
export const fetchEpic: ducks.Epic<actions.Action, any, model.AppState> = (
  action$,
  state$,
) =>
  pipe(
    action$,
    ducks.ofType<actions.Action, actions.EpicAction>('fetchCmd'),
    rx.withLatestFrom(state$),
    rx.mergeMap(([{ f }, state]) => f(state)),
  );

export default fetchEpic;
