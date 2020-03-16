import * as automaton from 'redux-automaton';
import * as R from 'fp-ts-rxjs/lib/Observable';
import * as RD from '@devexperts/remote-data-ts';
import * as record from 'fp-ts/lib/Record';
import * as set from 'fp-ts/lib/Set';
import * as E from 'fp-ts/lib/Either';
import * as Eq from 'fp-ts/lib/Eq';
import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';

import * as buddyApi from '../../api/buddies';

import * as actions from '../actions';
import * as model from '../model';

export type State = model.AppState['buddies'];

import { withToken } from './accessToken';

export const initialState = RD.initial;

export const reducer: automaton.Reducer<State, actions.Action> = (
  state: State = initialState,
  action: actions.Action,
) => {
  switch (action.type) {
    case 'messages/get/completed':
      return pipe(
        action.payload,
        E.fold(
          () => state,
          messages => {
            const requiredBuddies = set.fromArray(Eq.eqString)(
              record.keys(messages),
            );
            const hasAllBuddies = pipe(
              state,
              RD.map(record.keys),
              RD.map(set.fromArray(Eq.eqString)),
              RD.map(existingBuddies =>
                set.getEq(Eq.eqString).equals(existingBuddies, requiredBuddies),
              ),
              RD.getOrElse(() => false),
            );
            return hasAllBuddies
              ? state
              : automaton.loop(
                  RD.pending,
                  withToken(
                    flow(
                      buddyApi.fetchBuddies,
                      R.map(actions.make('buddies/completed')),
                    ),
                  ),
                );
          },
        ),
      );
    case 'buddies/completed':
      return RD.fromEither(action.payload);
    default:
      return state;
  }
};
