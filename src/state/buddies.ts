import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import { constant } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';

import * as selectors from './selectors';
import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['buddies'];

export const initialState = RD.initial;

export const reducer: automaton.Reducer<State, actions.Action> = (
  state: State = initialState,
  action: actions.Action,
) => {
  const matchAction = actions.match(state, action);
  const toLoading = constant(
    matchAction({
      fetchMessagesCompleted: () =>
        automaton.loop(RD.pending, {
          type: 'FetchCmd' as const,
          f: 'fetchBuddies' as const,
          args: selectors.getAC,
          onComplete: actions.creators.fetchBuddiesCompleted,
        }),
    }),
  );
  const toCompleted = constant(
    matchAction({
      fetchBuddiesCompleted: ({ payload }) => RD.fromEither(payload),
    }),
  );
  return pipe(
    state,
    RD.fold(toLoading, toCompleted, toLoading, constant(state)),
  );
};
/*
 * TODO onCompleted

      return matchAction({
        fetchMessagesCompleted: ({ payload }) =>
          taggedUnion.match(payload, {
            Ok: ({ value: threads }) => {
              const isFetchRequired =
                !env.buddies ||
                array
                  .fromNonTotalRecord(env.buddies)
                  .some(buddy => !(buddy.buddyId in threads));
              return isFetchRequired
                ? reduxLoop.loop(
                    remoteData.loading,
                    reduxLoop.Cmd.action(fetchBuddiesAction),
                  )
                : state;
            },
            Err: state,
          }),
      });


*/
