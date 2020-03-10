import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as R from 'fp-ts-rxjs/lib/Observable';
import { flow } from 'fp-ts/lib/function';

import * as accountApi from '../../api/account';
import * as err from '../../lib/http-err';

import * as actions from '../actions';

import { AppState } from '../model';
import { withToken } from './accessToken';

export const initialState = RD.initial;

export const reducer: automaton.Reducer<
  RD.RemoteData<err.Err, accountApi.UserAccount>,
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
          flow(
            accountApi.getMyUser,
            R.map(actions.make('userAccount/get/completed')),
          ),
        ),
      );
    case 'userAccount/get/completed':
      return RD.fromEither(action.payload);
    default:
      return state;
  }
};

export const select = ({ userAccount }: AppState) => userAccount;
