import * as reduxLoop from 'redux-loop';

import assertNever from '../lib/assert-never';
import * as result from '../lib/result';
import * as remoteData from '../lib/remote-data';
import * as taggedUnion from '../lib/tagged-union';
import * as tuple from '../lib/tuple';

import * as messageApi from '../api/messages';

import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['messages'];
export type LoopState = actions.LS<State>;
export const initialState = remoteData.notAsked;

export const reducer = (state: State, action: actions.Action) =>
  _reducer(state, action);

function _reducer(
  state: State = initialState,
  action: actions.Action,
): LoopState {
  const matchAction = actions.match(state, action);
  switch (state.type) {
    case 'NotAsked':
    case 'Err':
      return matchAction({
        fetchMessages: reduxLoop.loop(
          remoteData.loading,
          reduxLoop.Cmd.action(fetchMessagesAction),
        ),
      });
    case 'Loading':
      return matchAction({
        fetchMessagesCompleted: ({ payload }) =>
          taggedUnion.match(payload, {
            Ok: toOk,
            Err: err => err,
          }),
      });
    case 'Ok':
      const [messages, request] = state.value;
      const [nextMessages, cmd] = reduxLoop.liftState(
        _reducer(request, action),
      );
      const nextState: State =
        nextMessages.type === 'Ok'
          ? nextMessages
          : remoteData.ok(tuple.tuple(messages, nextMessages));
      return reduxLoop.loop(nextState, cmd);
    default:
      return assertNever(state);
  }
}

const fetchMessagesAction = actions.creators.requestWithToken({
  func: 'fetchMessages' as const,
  funcArgs: [],
  actionCreator: 'fetchMessagesCompleted' as const,
  actionCreatorArgs: [],
});

function toOk({ value: messages }: result.Ok<messageApi.Threads>): LoopState {
  return remoteData.ok([messages, remoteData.notAsked]);
}
