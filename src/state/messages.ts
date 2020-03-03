import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import { constant } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';

import * as selectors from './selectors';
import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['messages'];
export type LoopState = actions.LS<State>;

export const initialState = RD.initial;

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  const matchAction = actions.match(state, action);
  const toLoading = constant(
    matchAction({
      fetchMessages: automaton.loop(RD.pending, {
        type: 'FetchCmd' as const,
        f: 'fetchMessages' as const,
        args: selectors.getAC,
        onComplete: actions.creators.fetchMessagesCompleted,
      }),
    }),
  );

  // TODO: Fold successfull and start polling.
  const toCompleted = constant(
    matchAction({
      fetchMessagesCompleted: ({ payload }) => RD.fromEither(payload),
    }),
  );
  return pipe(
    state,
    RD.fold(toLoading, toCompleted, toLoading, constant(state)),
  );
};
