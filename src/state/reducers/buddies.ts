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
    case 'token/Acquired': {
      return automaton.loop(
        RD.pending,
        withToken(buddyApi.fakeBuddies, actions.make('buddies/completed')),
      );
    }

    case 'messages/get/completed': {
      const newMessageBuddies = pipe(
        action.payload,
        E.map(record.keys),
        E.getOrElse((): string[] => []),
      );

      const allBuddies = pipe(
        state,
        RD.map(record.keys),
        RD.getOrElse((): string[] => []),
      );

      const stateHasNewMessageBuddies =
        allBuddies.filter(buddy => !newMessageBuddies.includes(buddy)).length >
        0;

      return stateHasNewMessageBuddies
        ? state
        : automaton.loop(
            RD.pending,
            withToken(buddyApi.fakeBuddies, actions.make('buddies/completed')),
          );
    }

    case 'buddies/completed': {
      const buddies = pipe(
        action.payload,
        RD.fromEither,
        RD.map(record.keys),
        RD.getOrElse((): string[] => []),
      );

      return automaton.loop(
        RD.fromEither(action.payload),
        actions.make('messages/getLast/start')(buddies),
      );
    }

    case 'buddies/changeBanStatus/end': {
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
    }

    case 'buddies/changeBanStatusBatch/end':
      if (E.isRight(action.payload) && RD.isSuccess(state)) {
        const responseBuddies = action.payload.right;

        const deletedIds = Object.keys(responseBuddies).filter(
          key => responseBuddies[key].status === 'Deleted',
        );

        const filteredIds = Object.keys(state.value).filter(
          buddyId => !deletedIds.includes(buddyId),
        );

        const newState = filteredIds.reduce<Record<string, buddyApi.Buddy>>(
          (acc, curr) => {
            const updatedBuddy = responseBuddies[curr] ?? state.value[curr];

            return { ...acc, [curr]: updatedBuddy };
          },
          {},
        );

        return RD.success(newState);
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
