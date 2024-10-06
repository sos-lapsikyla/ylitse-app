import { Reducer } from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as automaton from 'redux-automaton';
import * as actions from '../actions';

import * as minimumVersionApi from '../../api/minimumVersion';

import { Action } from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';

import { pipe } from 'fp-ts/lib/function';

export const initialState = RD.initial;

export const reducer: Reducer<AppState['minimumVersion'], Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'minimumVersion/get/start': {
      if (RD.isPending(state)) {
        return state;
      }

      return automaton.loop(
        RD.pending,
        withToken(
          minimumVersionApi.fetchVersions,
          actions.make('minimumVersion/get/end'),
        ),
      );
    }

    case 'minimumVersion/get/end': {
      return pipe(action.payload, RD.fromEither);
    }

    default: {
      return state;
    }
  }
};

export const selectClientVersion =
  (client: string) =>
  ({ minimumVersion }: AppState) => {
    return pipe(
      minimumVersion,
      RD.fold(
        () => undefined, // NotAsked
        () => undefined, // Loading
        () => undefined, // Failure
        clients => clients.find(p => p.client === client),
      ),
    );
  };
