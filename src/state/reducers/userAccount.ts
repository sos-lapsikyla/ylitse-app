import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

import * as accountApi from '../../api/account';

import * as actions from '../actions';

import { AppState } from '../types';
import { withToken } from './accessToken';

export const initialState = RD.initial;
export const fetchUserAccount = actions.make('userAccount/get/start')(
  undefined,
);

export const reducer: automaton.Reducer<
  RD.RemoteData<string, accountApi.UserAccount>,
  actions.Action
> = (state = initialState, action) => {
  switch (action.type) {
    case 'userAccount/get/start':
      if (RD.isPending(state)) {
        return state;
      }
      return automaton.loop(
        RD.pending,
        withToken(
          accountApi.getMyUser,
          actions.make('userAccount/get/completed'),
        ),
      );
    case 'userAccount/get/completed':
      return RD.fromEither(action.payload);
    case 'changeEmail/completed':
      return pipe(
        action.payload,
        E.fold(
          () => state,
          ({ email }) =>
            RD.remoteData.map(state, (account) => ({ ...account, email })),
        ),
      );
    default:
      return state;
  }
};

export const getAccount = ({ userAccount }: AppState) => userAccount;
