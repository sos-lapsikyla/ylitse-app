import * as automaton from 'redux-automaton';
import * as R from 'fp-ts-rxjs/lib/Observable';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as record from 'fp-ts/lib/Record';

import * as messageApi from '../../api/messages';

import { cmd } from '.././actions/epic';
import * as actions from '../actions';
import * as model from '../model';
import * as selectors from '../selectors';

type State = Record<string, 'Requested'>;
export const initialState = {};

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'messages/markSeen':
      const markSeenCmd = cmd((appState: model.AppState) => {
        const token = selectors.getAC(appState);
        return pipe(
          R.fromOption(selectors.getMessage(appState, action.payload)),
          R.chain(message => messageApi.markSeen(message)(token)),
          R.map(actions.make('nothing')),
        );
      });
      const nextState = pipe(
        state,
        record.insertAt(action.payload.messageId, 'Requested' as const),
      );
      const loop = automaton.loop(nextState, markSeenCmd);
      return pipe(
        record.lookup(action.payload.messageId, state),
        O.fold<'Requested', actions.LS<State>>(() => loop, () => state),
      );
    default:
      return state;
  }
};
