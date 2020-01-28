import * as reduxSagaEffects from 'redux-saga/effects';

import * as remoteData from './remote-data';
import * as record from './record';

type UnpackPromise<Value> = Value extends Promise<infer U> ? U : never;

type InitAction<
  InitActionName extends string,
  F extends (...args: any[]) => any
> = {
  type: InitActionName;
  payload: Parameters<F>;
};
type InitActionCreator<
  InitActionName extends string,
  F extends (...args: any[]) => any
> = {
  [k in InitActionName]: (
    payload: Parameters<F>,
  ) => InitAction<InitActionName, F>;
};
type FailAction<FailureActionName extends string> = {
  type: FailureActionName;
  payload: Error;
};
type FailActionCreator<FailureActionName extends string> = {
  [k in FailureActionName]: (payload: Error) => FailAction<FailureActionName>;
};

type SuccessAction<
  SuccessActionName extends string,
  F extends (...args: any[]) => any
> = {
  type: SuccessActionName;
  payload: UnpackPromise<ReturnType<F>>;
};
type SuccessActionCreator<
  SuccessActionName extends string,
  F extends (...args: any[]) => any
> = {
  [k in SuccessActionName]: (
    payload: UnpackPromise<ReturnType<F>>,
  ) => SuccessAction<SuccessActionName, F>;
};

type ResetAction<ResetActionName extends string> = {
  type: ResetActionName;
  payload: Error;
};
type ResetActionCreator<ResetActionName extends string> = {
  [k in ResetActionName]: () => ResetAction<ResetActionName>;
};

type ActionCreators4<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
> = InitActionCreator<InitActionName, F> &
  FailActionCreator<FailureActionName> &
  SuccessActionCreator<SuccessActionName, F> &
  ResetActionCreator<ResetActionName>;

type ActionCreators3<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string
> = InitActionCreator<InitActionName, F> &
  FailActionCreator<FailureActionName> &
  SuccessActionCreator<SuccessActionName, F>;

export function makeActionCreators<
  F extends (...args: any[]) => any,
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
  F extends (...args: any[]) => any,
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
  F extends (...args: any[]) => any,
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
  const fail = record.singleton(failActionName, (payload: Error) => ({
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

type Reducer3<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string
> = (
  state: remoteData.RemoteData<UnpackPromise<ReturnType<F>>>,
  action:
    | InitAction<InitActionName, F>
    | FailAction<FailureActionName>
    | SuccessAction<SuccessActionName, F>
    | UnknownAction,
) => remoteData.RemoteData<UnpackPromise<ReturnType<F>>>;
type Reducer4<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
> = (
  state: remoteData.RemoteData<UnpackPromise<ReturnType<F>>>,
  action:
    | InitAction<InitActionName, F>
    | FailAction<FailureActionName>
    | SuccessAction<SuccessActionName, F>
    | ResetAction<ResetActionName>
    | UnknownAction,
) => remoteData.RemoteData<UnpackPromise<ReturnType<F>>>;

export function makeReducer<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string
>(
  _: F,
  init: InitActionName,
  fail: FailureActionName,
  success: SuccessActionName,
): Reducer3<F, InitActionName, FailureActionName, SuccessActionName>;
export function makeReducer<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
>(
  _: F,
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
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
>(
  _: F,
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
    state: remoteData.RemoteData<UnpackPromise<ReturnType<F>>>,
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
        return remoteData.loading;
      }
      case success: {
        const {
          payload,
        }: SuccessAction<SuccessActionName, F> = action as SuccessAction<
          SuccessActionName,
          F
        >;
        return remoteData.succeed(payload);
      }
      case fail: {
        const { payload }: FailAction<FailureActionName> = action as FailAction<
          FailureActionName
        >;
        return remoteData.fail(payload);
      }
      default:
        return state;
    }
  };
}

function makeSaga<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string
>(
  f: F,
  initActionName: InitActionName,
  failActionName: FailureActionName,
  successActionName: SuccessActionName,
  actions: ActionCreators3<
    F,
    InitActionName,
    FailureActionName,
    SuccessActionName
  >,
) {
  const fetchHandler = function*(action: InitAction<InitActionName, F>) {
    try {
      const value = yield reduxSagaEffects.call(f, ...action.payload);
      yield reduxSagaEffects.put(actions[successActionName](value));
    } catch (e) {
      yield reduxSagaEffects.put(actions[failActionName](e));
    }
  };
  return function*() {
    yield reduxSagaEffects.takeEvery(initActionName, fetchHandler);
  };
}

export function makeRemoteDataStateHandlers<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string
>(
  f: F,
  initActionName: InitActionName,
  failActionName: FailureActionName,
  successActionName: SuccessActionName,
): {
  actions: ActionCreators3<
    F,
    InitActionName,
    FailureActionName,
    SuccessActionName
  >;
  reducer: Reducer3<F, InitActionName, FailureActionName, SuccessActionName>;
  saga: () => Generator<reduxSagaEffects.ForkEffect<never>, void, unknown>;
};
export function makeRemoteDataStateHandlers<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
>(
  f: F,
  initActionName: InitActionName,
  failActionName: FailureActionName,
  successActionName: SuccessActionName,
  resetActionName?: ResetActionName,
): {
  actions: ActionCreators4<
    F,
    InitActionName,
    FailureActionName,
    SuccessActionName,
    ResetActionName
  >;
  reducer: Reducer4<
    F,
    InitActionName,
    FailureActionName,
    SuccessActionName,
    ResetActionName
  >;
  saga: () => Generator<reduxSagaEffects.ForkEffect<never>, void, unknown>;
};

export function makeRemoteDataStateHandlers<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string,
  ResetActionName extends string
>(
  f: F,
  initActionName: InitActionName,
  failActionName: FailureActionName,
  successActionName: SuccessActionName,
  resetActionName?: ResetActionName,
):
  | {
      actions: ActionCreators4<
        F,
        InitActionName,
        FailureActionName,
        SuccessActionName,
        ResetActionName
      >;
      reducer: Reducer4<
        F,
        InitActionName,
        FailureActionName,
        SuccessActionName,
        ResetActionName
      >;
      saga: () => Generator<reduxSagaEffects.ForkEffect<never>, void, unknown>;
    }
  | {
      actions: ActionCreators3<
        F,
        InitActionName,
        FailureActionName,
        SuccessActionName
      >;
      reducer: Reducer3<
        F,
        InitActionName,
        FailureActionName,
        SuccessActionName
      >;
      saga: () => Generator<reduxSagaEffects.ForkEffect<never>, void, unknown>;
    } {
  if (resetActionName) {
    const actions = makeActionCreators(
      f,
      initActionName,
      failActionName,
      successActionName,
      resetActionName,
    );
    const reducer = makeReducer(
      f,
      initActionName,
      failActionName,
      successActionName,
      resetActionName,
    );
    const saga = makeSaga(
      f,
      initActionName,
      failActionName,
      successActionName,
      actions,
    );
    return { actions, reducer, saga };
  } else {
    const actions = makeActionCreators(
      f,
      initActionName,
      failActionName,
      successActionName,
    );
    const reducer = makeReducer(
      f,
      initActionName,
      failActionName,
      successActionName,
    );
    const saga = makeSaga(
      f,
      initActionName,
      failActionName,
      successActionName,
      actions,
    );
    return { actions, reducer, saga };
  }
}
