import * as ducks from 'redux-observable';
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts-rxjs/lib/Observable';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import * as E from 'fp-ts/lib/Either';
import * as rx from 'rxjs/operators';

import * as err from '../../lib/http-err';

import * as actions from '../actions';
import * as model from '../model';

import { Deps } from '../deps';

export const fetchEpic: ducks.Epic<
  actions.Action,
  any,
  model.AppState,
  Deps
> = (action$, state$, deps) =>
  pipe(
    action$,
    ducks.ofType<actions.Action, actions.Pick<'FetchCmd'>>('FetchCmd'),
    rx.withLatestFrom(state$),
    rx.mergeMap(([fetchCmd, state]) => {
      const { f, args, onComplete } = fetchCmd;
      const fn: (...args: any[]) => RE.ObservableEither<err.Err, any> = deps[f];
      const argsAny: any[] = args(state);
      const onCompleteAny: (
        ma: E.Either<err.Err, any>,
      ) => actions.Action = onComplete;
      return pipe(
        fn(...argsAny),
        R.map(
          E.fold(
            e =>
              err.is401(e)
                ? actions.creators.refreshAccessToken
                : onCompleteAny(E.left(e)),
            a => onCompleteAny(E.right(a)),
          ),
        ),
      );
    }),
  );

export default fetchEpic;
