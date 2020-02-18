import * as redux from 'redux';
import * as reduxLoop from 'redux-loop';
import * as future from '../lib/future';
import * as result from '../lib/result';

export function effect<
  Names extends string,
  Action extends redux.Action<Names>,
  Args extends any[],
  A,
  E
>(
  task: future.Task<Args, A, E>,
  actionCreator: (response: result.Result<A, E>) => Action,
): reduxLoop.RunCmd<Action> {
  return reduxLoop.Cmd.run(task, { successActionCreator: actionCreator });
}
