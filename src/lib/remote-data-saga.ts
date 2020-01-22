import * as reduxSagaEffects from 'redux-saga/effects';

import * as remoteData from './remote-data';
import * as record from './record';

type UnpackPromise<Value> = Value extends Promise<infer U> ? U : never;

type InitAction<A extends string, F extends (...args: any[]) => any> = {
  type: A;
  payload: Parameters<F>;
};
type InitActionCreator<A extends string, F extends (...args: any[]) => any> = {
  [k in A]: (payload: Parameters<F>) => InitAction<A, F>;
};

type SuccessAction<A extends string, F extends (...args: any[]) => any> = {
  type: A;
  payload: UnpackPromise<ReturnType<F>>;
};
type SuccessActionCreator<
  A extends string,
  F extends (...args: any[]) => any
> = {
  [k in A]: (payload: UnpackPromise<ReturnType<F>>) => SuccessAction<A, F>;
};

type FailAction<A extends string> = {
  type: A;
  payload: Error;
};
type FailActionCreator<A extends string> = {
  [k in A]: (payload: Error) => FailAction<A>;
};

export function makeActionCreators<
  A extends string,
  B extends string,
  C extends string,
  F extends (...args: any[]) => any
>(
  initActionName: A,
  successActionName: B,
  failActionName: C,
  _: F,
): InitActionCreator<A, F> & SuccessActionCreator<B, F> & FailActionCreator<C> {
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
  return { ...init, ...success, ...fail };
}

type UnknownAction = {
  type: unknown;
  payload: unknown;
};

export function makeReducer<
  A extends string,
  B extends string,
  C extends string,
  F extends (...args: any[]) => any
>(init: A, success: B, fail: C, _: F) {
  const reducer: (
    state: remoteData.RemoteData<UnpackPromise<ReturnType<F>>>,
    action:
      | InitAction<A, F>
      | SuccessAction<B, F>
      | FailAction<C>
      | UnknownAction,
  ) => remoteData.RemoteData<UnpackPromise<ReturnType<F>>> = (
    state: remoteData.RemoteData<UnpackPromise<ReturnType<F>>>,
    action:
      | InitAction<A, F>
      | SuccessAction<B, F>
      | FailAction<C>
      | UnknownAction,
  ) => {
    switch (action.type) {
      case init: {
        return remoteData.loading;
      }
      case success: {
        const { payload }: SuccessAction<B, F> = action as SuccessAction<B, F>;
        return remoteData.succeed(payload);
      }
      case fail: {
        const { payload }: FailAction<C> = action as FailAction<C>;
        return remoteData.fail(payload);
      }
      default:
        return state;
    }
  };
  return reducer;
}

export function makeSaga<
  A extends string,
  B extends string,
  C extends string,
  F extends (...args: any[]) => any
>(initActionName: A, successActionName: B, failActionName: C, f: F) {
  const actions = makeActionCreators(
    initActionName,
    successActionName,
    failActionName,
    f,
  );
  const reducer = makeReducer(
    initActionName,
    successActionName,
    failActionName,
    f,
  );
  const fetchHandler = function*(action: InitAction<A, F>) {
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
