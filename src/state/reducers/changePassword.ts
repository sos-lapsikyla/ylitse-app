import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
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

export const initialState = RD.initial;

export const reducer: automaton.Reducer<
  RD.RemoteData<err.Err, true>,
  actions.Action
> = (state = initialState, action) => {
  switch (action.type) {
    case 'changePassword/reset':
      if (RD.isPending(state)) {
        return state;
      }
      return RD.initial;
    case 'changePassword/start':
      if (!RD.isInitial(state)) {
        return state;
      }
      return automaton.loop(
        RD.pending,
        withToken(
          flow(
            authApi.changePassword(action.payload),
            R.map(actions.make('changePassword/completed')),
          ),
        ),
      );
    case 'changePassword/completed':
      return automaton.loop(
        RD.fromEither(action.payload),
        cmd(() =>
          pipe(
            R.of(undefined),
            R.map(actions.make('changePassword/reset')),
            rx.delay(3000),
          ),
        ),
      );
    default:
      return state;
  }
};

export const select = ({ changePassword }: AppState) => changePassword;
