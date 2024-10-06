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

const isVersionBigEnough = (
  clientVersion: minimumVersionApi.AppClient,
  requiredVersion: minimumVersionApi.AppClient,
) => {
  if (clientVersion.major > requiredVersion.major) return true; // eslint-disable-next-line padding-line-between-statements
  if (clientVersion.major < requiredVersion.major) return false;

  // if major version equal, cmpare minor
  if (clientVersion.minor > requiredVersion.minor) return true; // eslint-disable-next-line padding-line-between-statements
  if (clientVersion.minor < requiredVersion.minor) return false;

  // compare patch
  return clientVersion.patch >= requiredVersion.patch;
};

// Default to true if no client found, or error in fetching
export const selectIsVersionBigEnough =
  (app: minimumVersionApi.AppClient) =>
  ({ minimumVersion }: AppState) => {
    return pipe(
      minimumVersion,
      RD.fold(
        () => true, // NotAsked
        () => true, // Loading
        () => true, // Failure
        clients => {
          const foundClient = clients.find(p => p.client === app.client);

          return foundClient ? isVersionBigEnough(app, foundClient) : true;
        },
      ),
    );
  };
