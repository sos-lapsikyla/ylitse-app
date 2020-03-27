import * as automaton from 'redux-automaton';
import * as remoteData from '@devexperts/remote-data-ts';
import * as R from 'fp-ts-rxjs/lib/Observable';
import * as rx from 'rxjs/operators';
import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';

import * as authApi from '../../api/auth';
import * as err from '../../lib/http-err';

import * as actions from '../actions';

import { AppState } from '../model';
import { withToken } from './accessToken';
import { cmd } from '../actions/epic';

export const changePassword = actions.make('changePassword/start');
export const initialState = remoteData.initial;
export const coolDownDuration = 5000;

export const reducer: automaton.Reducer<
  remoteData.RemoteData<err.Err, true>,
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
          flow(
            authApi.changePassword(action.payload),
            R.map(actions.make('changePassword/completed')),
          ),
        ),
      );
    case 'changePassword/completed':
      return automaton.loop(
        remoteData.fromEither(action.payload),
        cmd(() =>
          pipe(
            R.of(undefined),
            R.map(actions.make('changePassword/reset')),
            rx.delay(coolDownDuration),
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