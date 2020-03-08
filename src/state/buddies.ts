import * as automaton from 'redux-automaton';
import * as R from 'fp-ts-rxjs/lib/Observable';
import * as RD from '@devexperts/remote-data-ts';
import * as array from 'fp-ts/lib/Array';
import { monoidAll } from 'fp-ts/lib/Monoid';
import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';

import * as buddyApi from '../api/buddies';

import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['buddies'];

import { withToken } from './accessToken';

export const initialState = RD.initial;

export const reducer: automaton.Reducer<State, actions.Action> = (
  state: State = initialState,
  action: actions.Action,
) => {
  switch (action.type) {
    case 'messages/end':
      const hasAll = pipe(
        state,
        RD.map(buddies =>
          pipe(
            (id: string) => id in buddies,
            array.foldMap(monoidAll),
          ),
        ),
        RD.ap(RD.remoteData.map(RD.fromEither(action.payload), Object.keys)),
        RD.getOrElse(() => false),
      );
      if (hasAll) return state;
      return automaton.loop(
        RD.pending,
        withToken(
          flow(
            buddyApi.fetchBuddies,
            R.map(actions.make('buddies/end')),
          ),
        ),
      );
    case 'buddies/end':
      return RD.fromEither(action.payload);
    default:
      return state;
  }
};
