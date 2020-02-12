import * as reduxLoop from 'redux-loop';

import * as record from './record';
import * as remoteData from './remote-data';
import * as actionType from './action-type';
import * as future from './future';
import * as result from './result';

type StartAction<Name extends string, Args extends any[]> = {
  type: Name;
  payload: Args;
};
type StartActionCreator<Name extends string, Args extends any[]> = {
  [k in Name]: (payload: Args) => StartAction<Name, Args>;
};

type EndAction<Name extends string, A, E> = {
  type: Name;
  payload: result.Result<A, E>;
};
type EndActionCreator<Name extends string, A, E> = {
  [k in Name]: (payload: result.Result<A, E>) => EndAction<Name, A, E>;
};

type ResetAction<Name extends string> = {
  type: Name;
  payload: unknown;
};
type ResetActionCreator<Name extends string> = {
  [k in Name]: () => ResetAction<Name>;
};

type ActionCreators<
  Args extends any[],
  Val,
  Err,
  StartName extends string,
  EndName extends string,
  ResetName extends string
> = StartActionCreator<StartName, Args> &
  EndActionCreator<EndName, Val, Err> &
  ResetActionCreator<ResetName>;

export function makeActionCreators<
  Args extends any[],
  Val,
  Err,
  Start extends string,
  End extends string,
  Reset extends string
>(
  _: future.Task<Args, Val, Err>,
  initName: Start,
  completedName: End,
  resetName: Reset,
): ActionCreators<Args, Val, Err, Start, End, Reset> {
  const init = record.singleton(initName, (payload: Args) => ({
    type: initName,
    payload,
  }));
  const completed = record.singleton(
    completedName,
    (payload: result.Result<Val, Err>) => ({
      type: completedName,
      payload,
    }),
  );
  const reset = record.singleton(resetName, () => ({
    type: resetName,
    payload: undefined,
  }));
  return { ...init, ...completed, ...reset };
}

type Reducer<
  Args extends any[],
  Val,
  Err,
  Start extends string,
  End extends string,
  Reset extends string
> = (
  state: remoteData.RemoteData<Val, Err> | undefined,
  action:
    | StartAction<Start, Args>
    | EndAction<End, Val, Err>
    | ResetAction<Reset>
    | actionType.UnknownAction,
) =>
  | remoteData.RemoteData<Val, Err>
  | reduxLoop.Loop<
      remoteData.RemoteData<Val, Err>,
      StartAction<Start, Args> | EndAction<End, Val, Err> | ResetAction<Reset>
    >;

export function makeReducer<
  Args extends any[],
  Val,
  Err,
  Start extends string,
  End extends string,
  Reset extends string
>(
  task: future.Task<Args, Val, Err>,
  actions: ActionCreators<Args, Val, Err, Start, End, Reset>,
  init: Start,
  completed: End,
  reset: Reset,
): Reducer<Args, Val, Err, Start, End, Reset>;

export function makeReducer<
  Args extends any[],
  Val,
  Err,
  Start extends string,
  End extends string,
  Reset extends string
>(
  task: future.Task<Args, Val, Err>,
  actions: ActionCreators<Args, Val, Err, Start, End, Reset>,
  start: Start,
  end: End,
  reset: Reset,
): Reducer<Args, Val, Err, Start, End, Reset> {
  return (
    state: remoteData.RemoteData<Val, Err> | undefined = remoteData.notAsked,
    action:
      | StartAction<Start, Args>
      | EndAction<End, Val, Err>
      | ResetAction<Reset>
      | actionType.UnknownAction,
  ) => {
    switch (action.type) {
      case start: {
        if (remoteData.isLoading(state)) {
          return state;
        } else {
          const { payload } = action as StartAction<Start, Args>;
          return reduxLoop.loop(
            remoteData.loading,
            reduxLoop.Cmd.run(task, {
              args: payload,
              successActionCreator: actions[end],
            }),
          );
        }
      }
      case end: {
        const { payload } = action as EndAction<End, Val, Err>;
        return payload;
      }
      case reset: {
        return remoteData.notAsked;
      }
      default:
        return state;
    }
  };
}
