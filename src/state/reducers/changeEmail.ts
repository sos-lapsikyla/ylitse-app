import * as automaton from 'redux-automaton';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import * as RD from '@devexperts/remote-data-ts';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import * as R from 'fp-ts-rxjs/lib/Observable';
import * as rx from 'rxjs/operators';
import { tuple, tupled } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';

import * as authApi from '../../api/auth';
import * as accountApi from '../../api/account';

import * as actions from '../actions';

import { AppState } from '../model';
import { cmd } from '../actions/epic';

import { getToken } from './accessToken';

export const changeEmail = actions.make('changeEmail/start');
export const resetChangeEmail = actions.make('changeEmail/reset')(undefined);

export const initialState = RD.initial;
export const coolDownDuration = 5000;

const _changeEmail = (
  newEmailAddress?: string,
  account?: accountApi.UserAccount,
) => (appState: AppState) => {
  const updatedAccount = pipe(
    O.fromNullable(account),
    O.map(({ role, userName, accountId }) => ({
      id: accountId,
      email: newEmailAddress,
      role,
      userName,
    })),
  );

  const both = pipe(
    updatedAccount,
    O.map(account_ => (token: authApi.AccessToken) => tuple(token, account_)),
    O.ap(getToken(appState)),
    E.fromOption(() => 'Failure on _changeEmail.'),
  );

  return pipe(
    R.of(both),
    RE.chain(tupled(accountApi.putAccount)),
    RE.map(({ email }) => ({ email })),
    R.map(actions.make('changeEmail/completed')),
  );
};

export const reducer: automaton.Reducer<
  AppState['changeEmail'],
  actions.Action
> = (state = initialState, action) => {
  switch (action.type) {
    case 'changeEmail/start':
      if (!RD.isInitial(state)) {
        return state;
      }
      return automaton.loop(
        RD.pending,
        cmd(_changeEmail(action.payload.email, action.payload.account)),
      );
    case 'changeEmail/completed':
      return automaton.loop(
        RD.fromEither(action.payload),
        cmd(() =>
          pipe(
            R.of(resetChangeEmail),
            rx.delay(coolDownDuration),
          ),
        ),
      );
    case 'changeEmail/reset':
      if (RD.isPending(state)) {
        return state;
      }
      return RD.initial;
    default:
      return state;
  }
};

export const select = ({ changeEmail: state }: AppState) => state;
