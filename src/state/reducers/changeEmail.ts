import * as automaton from 'redux-automaton';
import * as O from 'fp-ts/lib/Option';
import * as RD from '@devexperts/remote-data-ts';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';

import * as authApi from '../../api/auth';
import * as accountApi from '../../api/account';

import * as actions from '../actions';

import { AppState } from '../types';
import { cmd } from '../middleware';
import { withToken } from './accessToken';

export const changeEmail = actions.make('changeEmail/start');
export const resetChangeEmail = actions.make('changeEmail/reset')(undefined);

export const initialState = RD.initial;
export const coolDownDuration = 5000;

const _changeEmail =
  ({ email, account }: { email?: string; account?: accountApi.UserAccount }) =>
  (token: authApi.AccessToken) => {
    return pipe(
      O.fromNullable(account),
      O.map(({ role, userName, accountId }) => ({
        id: accountId,
        email: email,
        role,
        userName,
      })),
      TE.fromOption(() => 'Bad stuff'),
      TE.chain(accountWithNewEmail =>
        accountApi.putAccount(token, accountWithNewEmail),
      ),
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
        withToken(
          _changeEmail(action.payload),
          actions.make('changeEmail/completed'),
        ),
      );
    case 'changeEmail/completed':
      return automaton.loop(
        RD.fromEither(action.payload),
        cmd(pipe(T.of(resetChangeEmail), T.delay(coolDownDuration))),
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
