import { Reducer } from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as automaton from 'redux-automaton';
import * as actions from '../actions';
import * as T from 'fp-ts/lib/Task';

import * as minimumVersionApi from '../../api/minimumVersion';
import { cmd } from '../middleware';

import { Action } from '../actions';
import { AppState } from '../types';

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
        cmd(
          pipe(
            minimumVersionApi.fetchVersions(),
            T.map(actions.make('minimumVersion/get/end')),
          ),
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

export const selectClientVersions = ({ minimumVersion }: AppState) =>
  minimumVersion;
