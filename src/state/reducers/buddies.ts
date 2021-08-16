import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as record from 'fp-ts/lib/Record';
import * as set from 'fp-ts/lib/Set';
import * as E from 'fp-ts/lib/Either';
import * as Eq from 'fp-ts/lib/Eq';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';

import * as buddyApi from '../../api/buddies';

import * as actions from '../actions';
import * as types from '../types';

export type State = types.AppState['buddies'];

import { withToken } from './accessToken';
import * as messageState from './messages';
import * as banBuddyRequestState from './banBuddyRequest';

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
                    buddyApi.fetchBuddies,
                    actions.make('buddies/completed'),
                  ),
                );
          },
        ),
      );

    case 'buddies/completed':
      return RD.fromEither(action.payload);

    case 'buddies/changeBanStatus/end':
      return pipe(
        action.payload,
        E.fold(
          () => state,
          buddy =>
            pipe(
              state,
              RD.map(buddies => ({
                ...buddies,
                [buddy.buddyId]: buddy,
              })),
            ),
        ),
      );

    case 'buddies/changeBanStatusBatch/end':
      if (E.isRight(action.payload)) {
        const items = action.payload.right;

        const deletedIds = Object.keys(items).filter(
          key => items[key].status === 'Deleted',
        );

        if (RD.isSuccess(state)) {
          const filteredIds = Object.keys(state.value).filter(
            buddyId => !deletedIds.includes(buddyId),
          );

          const newState = filteredIds.reduce<Record<string, buddyApi.Buddy>>(
            (acc, curr) => {
              return { ...acc, [curr]: state.value[curr] };
            },
            {},
          );

          return RD.success(newState);
        }

        return state;
      }

      return state;

    default:
      return state;
  }
};

const getBuddiesWithStatus = (status: buddyApi.Buddy['status']) =>
  flow(
    ({ buddies }: types.AppState) => buddies,
    RD.map(buddies =>
      Object.values(buddies).filter(
        ({ status: buddyStatus }) => buddyStatus === status,
      ),
    ),
  );

const getBuddies =
  (status: buddyApi.Buddy['status']) => (appState: types.AppState) => {
    const remoteBuddies = getBuddiesWithStatus(status)(appState);

    const remoteBuddyOrder = messageState.getOrder(appState);

    const banBuddyRequest =
      banBuddyRequestState.selectBanBuddyRequest(appState);

    if (RD.isPending(banBuddyRequest)) {
      return RD.pending;
    }

    const both = RD.combine(remoteBuddies, remoteBuddyOrder);

    return RD.remoteData.map(both, ([buddyList, buddyOrder]) =>
      [...buddyList].sort(
        (a, b) => (buddyOrder[b.buddyId] || 0) - (buddyOrder[a.buddyId] || 0),
      ),
    );
  };

export const getBannedBuddies = getBuddies('Banned');

export const getActiveBuddies = getBuddies('NotBanned');
