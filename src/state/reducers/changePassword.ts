import * as automaton from 'redux-automaton';
import * as remoteData from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';

import * as authApi from '../../api/auth';

import * as actions from '../actions';

import { AppState } from '../types';
import { withToken } from './accessToken';
import { cmd } from '../middleware';

export const changePassword = actions.make('changePassword/start');
export const initialState = remoteData.initial;
export const coolDownDuration = 5000;

export const reducer: automaton.Reducer<
  remoteData.RemoteData<string, true>,
  actions.Action
> = (state = initialState, action) => {
  switch (action.type) {
    case 'changePassword/start':
      if (!remoteData.isInitial(state)) {
        return state;
      }

      return automaton.loop(
        remoteData.pending,
        withToken(
          authApi.changePassword(action.payload),
          actions.make('changePassword/completed'),
        ),
      );
    case 'changePassword/completed':
      return automaton.loop(
        remoteData.fromEither(action.payload),
        cmd(
          pipe(
            T.of(undefined),
            T.map(actions.make('changePassword/reset')),
            T.delay(coolDownDuration),
          ),
        ),
      );
    case 'changePassword/reset':
      if (remoteData.isPending(state)) {
        return state;
      }

      return remoteData.initial;
    default:
      return state;
  }
};

export const select = ({ changePassword: state }: AppState) => state;
