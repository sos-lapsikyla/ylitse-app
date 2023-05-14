import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as record from 'fp-ts/lib/Record';
import * as E from 'fp-ts/lib/Either';
import { pipe, flow } from 'fp-ts/lib/function';

import * as buddyApi from '../../api/buddies';

import * as actions from '../actions';
import * as types from '../types';

export type State = types.AppState['buddies'];

import { withToken } from './accessToken';
import * as messageState from './messages';
import * as changeChatStatusState from './changeChatStatus';

export const initialState = { buddies: RD.initial, isInitialFetch: true };

export const reducer: automaton.Reducer<State, actions.Action> = (
  state: State = initialState,
  action: actions.Action,
) => {
  switch (action.type) {
    case 'token/Acquired': {
      return automaton.loop(
        { ...state, buddies: RD.pending },
        withToken(buddyApi.fetchBuddies, actions.make('buddies/completed')),
      );
    }

    case 'messages/get/completed': {
      const buddies = E.isRight(action.payload)
        ? action.payload.right.buddies
        : {};

      const newMessageBuddies = new Set(
        Object.keys(buddies).map(buddyId => buddyId),
      );

      const stateBuddies = new Set(
        pipe(
          state.buddies,
          RD.map(record.keys),
          RD.getOrElse((): string[] => []),
        ),
      );

      let areSetsEqual = (a: Set<string>, b: Set<string>) =>
        a.size === b.size && [...a].every(value => b.has(value));

      const areBuddieSetsEqual = areSetsEqual(newMessageBuddies, stateBuddies);

      return areBuddieSetsEqual
        ? state
        : automaton.loop(
            { ...state, buddies: RD.pending },
            withToken(buddyApi.fetchBuddies, actions.make('buddies/completed')),
          );
    }

    case 'buddies/completed': {
      const buddyIds = pipe(
        action.payload,
        RD.fromEither,
        RD.map(record.keys),
        RD.getOrElse((): string[] => []),
      );

      const isBuddyFetchFailure = E.isLeft(action.payload);

      const isInitialFetch =
        isBuddyFetchFailure && state.isInitialFetch ? true : false;

      const nextState = {
        isInitialFetch,
        buddies: RD.fromEither(action.payload),
      };

      return state.isInitialFetch && !isBuddyFetchFailure
        ? automaton.loop(
            nextState,
            actions.make('messages/setPollingParams')({
              type: 'InitialMessages',
              buddyIds,
            }),
          )
        : nextState;
    }

    case 'buddies/changeChatStatus/end': {
      const nextBuddies = pipe(
        action.payload,
        E.fold(
          () => state.buddies,
          buddy =>
            pipe(
              state.buddies,
              RD.map(buddies => ({
                ...buddies,
                [buddy.buddyId]: buddy,
              })),
            ),
        ),
      );

      return { ...state, buddies: nextBuddies };
    }

    case 'buddies/changeChatStatusBatch/end': {
      if (E.isRight(action.payload) && RD.isSuccess(state.buddies)) {
        const responseBuddies = action.payload.right;
        const stateBuddies = state.buddies.value;

        const deletedIds = Object.keys(responseBuddies).filter(
          key => responseBuddies[key].status === 'deleted',
        );

        const filteredIds = Object.keys(stateBuddies).filter(
          buddyId => !deletedIds.includes(buddyId),
        );

        const nextBuddies = filteredIds.reduce<Record<string, buddyApi.Buddy>>(
          (acc, curr) => {
            const updatedBuddy = responseBuddies[curr] ?? stateBuddies[curr];

            return { ...acc, [curr]: updatedBuddy };
          },
          {},
        );

        return { ...state, buddies: RD.success(nextBuddies) };
      }

      return state;
    }

    case 'mentors/end': {
      if (E.isRight(action.payload) && RD.isSuccess(state.buddies)) {
        const mentors = action.payload.right;
        const stateBuddies = state.buddies.value;
        const buddyIds = Object.keys(stateBuddies);

        const nextBuddies = buddyIds.reduce<Record<string, buddyApi.Buddy>>(
          (buddies, id) => {
            const updatedBuddy = mentors[id]
              ? { ...stateBuddies[id], name: mentors[id].name }
              : stateBuddies[id];

            return { ...buddies, [id]: updatedBuddy };
          },
          {},
        );

        return { ...state, buddies: RD.success(nextBuddies) };
      }

      return state;
    }

    default:
      return state;
  }
};

const getBuddiesWithStatus = (status: buddyApi.Buddy['status']) =>
  flow(
    ({ buddies }: types.AppState) => buddies.buddies,
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

    const changeChatStatusRequest =
      changeChatStatusState.selectChatStatusRequest(appState);

    if (RD.isPending(changeChatStatusRequest)) {
      return RD.pending;
    }

    const both = RD.combine(remoteBuddies, remoteBuddyOrder);

    return RD.remoteData.map(both, ([buddyList, buddyOrder]) =>
      [...buddyList].sort(
        (a, b) => (buddyOrder[b.buddyId] || 0) - (buddyOrder[a.buddyId] || 0),
      ),
    );
  };

export const getBannedBuddies = getBuddies('banned');

export const getArchivedBuddies = getBuddies('archived');

export const getActiveBuddies = getBuddies('ok');

export const getIsBuddy = (buddyId: string) => (appState: types.AppState) => {
  const { buddies } = appState.buddies;

  if (RD.isSuccess(buddies)) {
    const foundBuddy = buddies.value[buddyId];

    return !!foundBuddy;
  }

  return false;
};
