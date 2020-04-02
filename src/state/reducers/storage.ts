import * as RD from '@devexperts/remote-data-ts';
import * as automaton from 'redux-automaton';
import * as T from 'fp-ts/lib/Task';
import * as O from 'fp-ts/lib/Option';

import * as storageApi from '../../api/storage';

import * as actions from '../actions';
import { AppState } from '../model';
import { cmd } from '../middleware';

export type State = AppState['storage'];

export const readToken = actions.make('storage/readToken/start')(undefined);

export const initialState: State = {
  readToken: RD.initial,
  writeToken: RD.initial,
};

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'storage/readToken/start': {
      return automaton.loop(
        { ...state, readToken: RD.pending },
        cmd(
          T.task.map(
            storageApi.readToken,
            actions.make('storage/readToken/end'),
          ),
        ),
      );
    }
    case 'storage/readToken/end': {
      const nextState = { ...state, readToken: RD.fromEither(action.payload) };
      const token = O.toNullable(O.fromEither(action.payload));
      if (!token) {
        return nextState;
      }
      return automaton.loop(nextState, actions.make('token/Acquired')(token));
    }
    case 'storage/writeToken/start': {
      return state;
    }
    case 'storage/writeToken/end': {
      return state;
    }
    default:
      return state;
  }
};

export const getReadToken = ({ storage: { readToken } }: AppState) => readToken;
