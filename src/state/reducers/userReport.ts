import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';

import * as actions from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';
import * as userReportApi from '../../api/userReport';

export const initialState = RD.initial;

type State = AppState['userReport'];

export const reducer: automaton.Reducer<State, actions.Action> = (
  state: State = initialState,
  action: actions.Action,
) => {
  switch (action.type) {
    case 'userReport/start': {
      return automaton.loop(
        state,
        withToken(
          userReportApi.reportUser(action.payload),
          actions.make('userReport/end'),
        ),
      );
    }

    case 'userReport/end': {
      return state;
    }
    default: {
      return state;
    }
  }
};

export const selectUserReportRequest = ({ userReport: state }: AppState) =>
  state;

export const selectIsUserReportLoading = (state: AppState): boolean => {
  return RD.isPending(state.userReport);
};
