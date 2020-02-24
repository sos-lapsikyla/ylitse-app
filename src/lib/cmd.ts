import * as redux from 'redux';
import * as reduxLoop from 'redux-loop';

type UnpackPromise<T> = T extends PromiseLike<infer U> ? U : T;

export function effect<
  Names extends string,
  Action extends redux.Action<Names>,
  Fn extends () => any
>(
  thunk: Fn,
  actionCreator: (response: UnpackPromise<ReturnType<Fn>>) => Action,
): reduxLoop.RunCmd<Action> {
  return reduxLoop.Cmd.run(thunk, { successActionCreator: actionCreator });
}
