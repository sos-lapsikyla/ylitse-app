import * as record from './record';
import * as remoteData from './remote-data';
import * as reduxLoop from 'redux-loop';

type Fn = (...args: any[]) => any;
type UnpackPromise<Value> = Value extends Promise<infer U> ? U : never;

type InitAction<InitActionName extends string, F extends Fn> = {
  type: InitActionName;
  payload: Parameters<F>;
};
type InitActionCreator<InitActionName extends string, F extends Fn> = {
  [k in InitActionName]: (
    payload: Parameters<F>,
  ) => InitAction<InitActionName, F>;
};
type FailAction<FailureActionName extends string> = {
  type: FailureActionName;
  payload: unknown;
};
type FailActionCreator<FailureActionName extends string> = {
  [k in FailureActionName]: (payload: unknown) => FailAction<FailureActionName>;
};

type SuccessAction<SuccessActionName extends string, F extends Fn> = {
  type: SuccessActionName;
  payload: UnpackPromise<ReturnType<F>>;
};
type SuccessActionCreator<SuccessActionName extends string, F extends Fn> = {
  [k in SuccessActionName]: (
    payload: UnpackPromise<ReturnType<F>>,
  ) => SuccessAction<SuccessActionName, F>;
};

type ResetAction<ResetActionName extends string> = {
  type: ResetActionName;
  payload: unknown;
};
type ResetActionCreator<ResetActionName extends string> = {
  [k in ResetActionName]: () => ResetAction<ResetActionName>;
};

type ActionCreators4<
  F extends Fn,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
> = InitActionCreator<InitActionName, F> &
  FailActionCreator<FailureActionName> &
  SuccessActionCreator<SuccessActionName, F> &
  ResetActionCreator<ResetActionName>;

type ActionCreators3<
  F extends Fn,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string
> = InitActionCreator<InitActionName, F> &
  FailActionCreator<FailureActionName> &
  SuccessActionCreator<SuccessActionName, F>;

export function makeActionCreators<
  F extends Fn,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string
>(
  _: F,
  initActionName: InitActionName,
  failActionName: FailureActionName,
  successActionName: SuccessActionName,
): ActionCreators3<F, InitActionName, FailureActionName, SuccessActionName>;

export function makeActionCreators<
  F extends Fn,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
>(
  _: F,
  initActionName: InitActionName,
  failActionName: FailureActionName,
  successActionName: SuccessActionName,
  resetActionName: ResetActionName,
): ActionCreators4<
  F,
  InitActionName,
  FailureActionName,
  SuccessActionName,
  ResetActionName
>;

export function makeActionCreators<
  F extends Fn,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
>(
  _: F,
  initActionName: InitActionName,
  failActionName: FailureActionName,
  successActionName: SuccessActionName,
  resetActionName?: ResetActionName,
):
  | ActionCreators4<
      F,
      InitActionName,
      FailureActionName,
      SuccessActionName,
      ResetActionName
    >
  | ActionCreators3<F, InitActionName, FailureActionName, SuccessActionName> {
  const init = record.singleton(initActionName, (payload: Parameters<F>) => ({
    type: initActionName,
    payload,
  }));
  const success = record.singleton(
    successActionName,
    (payload: UnpackPromise<ReturnType<F>>) => ({
      type: successActionName,
      payload,
    }),
  );
  const fail = record.singleton(failActionName, (payload: unknown) => ({
    type: failActionName,
    payload,
  }));
  const actions = { ...init, ...fail, ...success };
  if (resetActionName === undefined) {
    return actions;
  } else {
    const reset = record.singleton(resetActionName, () => ({
      type: resetActionName,
      payload: undefined,
    }));
    return {
      ...actions,
      ...reset,
    };
  }
}

type UnknownAction = {
  type: unknown;
  payload: unknown;
};

type State<F extends Fn> = remoteData.RemoteData<UnpackPromise<ReturnType<F>>>;

type Reducer3<
  F extends Fn,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string
> = (
  state: State<F> | undefined,
  action:
    | InitAction<InitActionName, F>
    | FailAction<FailureActionName>
    | SuccessAction<SuccessActionName, F>
    | UnknownAction,
) =>
  | State<F>
  | reduxLoop.Loop<
      State<F>,
      | InitAction<InitActionName, F>
      | FailAction<FailureActionName>
      | SuccessAction<SuccessActionName, F>
    >;
type Reducer4<
  F extends Fn,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
> = (
  state: State<F> | undefined,
  action:
    | InitAction<InitActionName, F>
    | FailAction<FailureActionName>
    | SuccessAction<SuccessActionName, F>
    | ResetAction<ResetActionName>
    | UnknownAction,
) =>
  | State<F>
  | reduxLoop.Loop<
      State<F>,
      | InitAction<InitActionName, F>
      | FailAction<FailureActionName>
      | SuccessAction<SuccessActionName, F>
      | ResetAction<ResetActionName>
    >;

export function makeReducer<
  F extends Fn,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string
>(
  f: F,
  actions: ActionCreators3<
    F,
    InitActionName,
    FailureActionName,
    SuccessActionName
  >,
  init: InitActionName,
  fail: FailureActionName,
  success: SuccessActionName,
): Reducer3<F, InitActionName, FailureActionName, SuccessActionName>;
export function makeReducer<
  F extends Fn,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
>(
  f: F,
  actions: ActionCreators3<
    F,
    InitActionName,
    FailureActionName,
    SuccessActionName
  >,
  init: InitActionName,
  fail: FailureActionName,
  success: SuccessActionName,
  reset: ResetActionName,
): Reducer4<
  F,
  InitActionName,
  FailureActionName,
  SuccessActionName,
  ResetActionName
>;

export function makeReducer<
  F extends Fn,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
>(
  f: F,
  actions: ActionCreators3<
    F,
    InitActionName,
    FailureActionName,
    SuccessActionName
  >,
  init: InitActionName,
  fail: FailureActionName,
  success: SuccessActionName,
  reset?: ResetActionName,
):
  | Reducer3<F, InitActionName, FailureActionName, SuccessActionName>
  | Reducer4<
      F,
      InitActionName,
      FailureActionName,
      SuccessActionName,
      ResetActionName
    > {
  return (
    state: State<F> | undefined = remoteData.notAsked,
    action:
      | InitAction<InitActionName, F>
      | FailAction<FailureActionName>
      | SuccessAction<SuccessActionName, F>
      | ResetAction<ResetActionName>
      | UnknownAction,
  ) => {
    if (!!reset && action.type === reset) {
      return remoteData.notAsked;
    }
    switch (action.type) {
      case init: {
        if (remoteData.isLoading(state)) {
          return state;
        } else {
          const { payload } = action as InitAction<InitActionName, F>;
          return reduxLoop.loop(
            remoteData.loading,
            reduxLoop.Cmd.run(f, {
              args: payload,
              successActionCreator: actions[success],
              failActionCreator: actions[fail],
            }),
          );
        }
      }
      case success: {
        const {
          payload,
        }: SuccessAction<SuccessActionName, F> = action as SuccessAction<
          SuccessActionName,
          F
        >;
        return remoteData.ok(payload);
      }
      case fail: {
        const { payload }: FailAction<FailureActionName> = action as FailAction<
          FailureActionName
        >;
        return remoteData.err(payload);
      }
      default:
        return state;
    }
  };
}
