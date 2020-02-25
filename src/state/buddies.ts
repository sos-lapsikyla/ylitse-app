import * as reduxLoop from 'redux-loop';

import assertNever from '../lib/assert-never';
import * as remoteData from '../lib/remote-data';
import * as result from '../lib/result';
import * as record from '../lib/record';
import * as array from '../lib/array';
import * as taggedUnion from '../lib/tagged-union';

import * as buddyApi from '../api/buddies';

import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['buddies'];
export type LoopState = actions.LS<State>;

export const initialState = remoteData.notAsked;

export const reducer = (state: State = initialState, action: actions.Action) =>
  _reducer({}, state, action);

type Env = {
  buddies?: record.NonTotal<buddyApi.Buddy>;
};

const fetchBuddiesAction = actions.creators.requestWithToken({
  func: 'fetchBuddies' as const,
  funcArgs: [],
  actionCreator: 'fetchBuddiesCompleted' as const,
  actionCreatorArgs: [],
});

export function _reducer(
  env: Env,
  state: State = initialState,
  action: actions.Action,
): LoopState {
  const matchAction = actions.match(state, action);
  switch (state.type) {
    case 'NotAsked':
    case 'Err':
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
    case 'Loading':
      return matchAction({
        fetchBuddiesCompleted: ({ payload }) =>
          taggedUnion.match(payload, {
            Ok: toOk,
            Err: err => err,
          }),
      });
    case 'Ok':
      const [buddies, request] = state.value;
      const [nextBuddies, cmd] = reduxLoop.liftState(
        _reducer({ ...env, buddies }, request, action),
      );
      const nextState: State =
        nextBuddies.type === 'Ok'
          ? nextBuddies
          : remoteData.ok([buddies, nextBuddies]);
      return reduxLoop.loop(nextState, cmd);
    default:
      return assertNever(state);
  }
}

function toOk({
  value: buddies,
}: result.Ok<record.NonTotal<buddyApi.Buddy>>): LoopState {
  return remoteData.ok([buddies, remoteData.notAsked]);
}
