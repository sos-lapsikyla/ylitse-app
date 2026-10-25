import * as T from 'fp-ts/lib/Task';
import * as redux from 'redux';

export type Cmd<A = redux.Action> = {
  type: 'Cmd';
  task: T.Task<A>;
};

export function cmd<A = redux.Action>(task: T.Task<A>): Cmd<A> {
  return {
    type: 'Cmd',
    task,
  };
}

function isCmd(action: unknown): action is Cmd {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    action.type === 'Cmd' &&
    'task' in action &&
    typeof action.task === 'function'
  );
}

export const taskRunner: redux.Middleware =
  ({ dispatch }) =>
  next =>
  (action: unknown) => {
    if (isCmd(action)) {
      const { task } = action;

      return task().then(resultAction => dispatch(resultAction));
    }

    return next(action);
  };
