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
  [k in ResetActionName]: (payload: Error) => FailAction<ResetActionName>;
};

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
): InitActionCreator<InitActionName, F> &
  FailActionCreator<FailureActionName> &
  SuccessActionCreator<SuccessActionName, F> {
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
  return { ...init, ...fail, ...success };
}

type UnknownAction = {
  type: unknown;
  payload: unknown;
};

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
) {
  const reducer: (
    state: remoteData.RemoteData<UnpackPromise<ReturnType<F>>>,
    action:
      | InitAction<InitActionName, F>
      | SuccessAction<SuccessActionName, F>
      | FailAction<FailureActionName>
      | UnknownAction,
  ) => remoteData.RemoteData<UnpackPromise<ReturnType<F>>> = (
    state: remoteData.RemoteData<UnpackPromise<ReturnType<F>>>,
    action:
      | InitAction<InitActionName, F>
      | SuccessAction<SuccessActionName, F>
      | FailAction<FailureActionName>
      | UnknownAction,
  ) => {
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
  return reducer;
}

export function makeSaga<
  F extends (...args: any[]) => any,
  InitActionName extends string,
  FailureActionName extends string,
  SuccessActionName extends string
>(
  f: F,
  initActionName: InitActionName,
  failActionName: FailureActionName,
  successActionName: SuccessActionName,
) {
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
  const fetchHandler = function*(action: InitAction<InitActionName, F>) {
    try {
      const value = yield reduxSagaEffects.call(f, ...action.payload);
      yield reduxSagaEffects.put(actions[successActionName](value));
    } catch (e) {
      yield reduxSagaEffects.put(actions[failActionName](e));
    }
  };
  const saga = function*() {
    yield reduxSagaEffects.takeEvery(initActionName, fetchHandler);
  };

  return { actions, reducer, saga };
}
