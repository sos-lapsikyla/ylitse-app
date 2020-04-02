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

function isCmd(action: redux.Action | Cmd): action is Cmd {
  return action.type === 'Cmd';
}

export const taskRunner = ({ dispatch }: redux.MiddlewareAPI) => (
  next: any,
) => (action: redux.Action | Cmd) => {
  if (isCmd(action)) {
    const { task } = action;
    console.warn(action);
    return task().then(resultAction => dispatch(resultAction));
  }
  return next(action);
};
