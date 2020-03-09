import * as reduxLoop from 'redux-loop';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import * as mentorsApi from '../api/mentors';

import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['mentors'];

export const initialState = RD.initial;

export const reducer = (state: State, action: actions.Action) => {
  switch (action.type) {
    case 'fetchMentors':
      return reduxLoop.loop(
        RD.pending,
        reduxLoop.Cmd.run(mentorsApi.fetchMentors(), {
          successActionCreator: actions.creators.fetchMentorsCompleted,
        }),
      );
    case 'fetchMentorsCompleted':
      return pipe(
        action.payload,
        RD.fromEither,
      );
    default:
      return state;
  }
};
