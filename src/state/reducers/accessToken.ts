import * as RD from '@devexperts/remote-data-ts';
import * as R from 'fp-ts-rxjs/lib/Observable';
import * as record from 'fp-ts/lib/Record';
import * as automaton from 'redux-automaton';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Observable } from 'rxjs';

import * as authApi from '../../api/auth';

import * as http from '../../lib/http';

import * as actions from '../actions';
import { AppState } from '../model';
import { cmd } from '../actions/epic';

export type State = AppState['accessToken'];

export const initialState: State = {
  currentToken: O.none,
  nextToken: RD.initial,
  index: 0,
  tasks: {},
  deferredTasks: [],
};

export const getToken = ({ accessToken }: AppState) => accessToken.currentToken;

export function withToken<A>(
  task: (token: authApi.AccessToken) => Observable<A>,
  action: (result: A) => actions.RegularAction,
) {
  return actions.make('token/doRequest/init')({ task, action });
}

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'token/Acquired': {
      return {
        ...state,
        currentToken: O.some(action.payload),
      };
    }
    case 'token/doRequest/init': {
      const index = state.index + 1;
      const token = O.toUndefined(state.currentToken);
      if (!token || RD.isPending(state.nextToken)) {
        return {
          ...state,
          index,
          deferredTasks: [...state.deferredTasks, action.payload],
        };
      }
      const nextState = {
        ...state,
        index,
        tasks: { ...state.tasks, [index]: action.payload },
      };
      const task = action.payload.task(token);
      const nextCmd = cmd(() =>
        R.observable.map(task, result =>
          actions.make('token/doRequest/completed')({
            index: `${index}`,
            result,
          }),
        ),
      );
      return automaton.loop(nextState, nextCmd);
    }
    case 'token/doRequest/completed': {
      const index = action.payload.index;
      const taskAndTasks = pipe(
        state.tasks,
        record.pop(index),
        O.toNullable,
      );
      if (!taskAndTasks) {
        return state;
      }
      const [task, tasks] = taskAndTasks;

      const result = action.payload.result;
      if (
        pipe(
          result,
          O.getLeft,
          O.toNullable,
          http.isUnauthorized,
        )
      ) {
        return automaton.loop(
          {
            ...state,
            tasks,
            deferredTasks: [...state.deferredTasks, task],
          },
          actions.make('token/refresh/start')(undefined),
        );
      }
      const nextState = {
        ...state,
        tasks,
      };
      const nextAction = task.action(result);
      return automaton.loop(nextState, nextAction);
    }
    case 'token/refresh/start': {
      if (RD.isPending(state.nextToken)) {
        return state;
      }
      return automaton.loop(
        {
          ...state,
          nextToken: RD.pending,
        },
        withToken(
          authApi.refreshAccessToken,
          actions.make('token/refresh/end'),
        ),
      );
    }
    case 'token/refresh/end': {
      return pipe(
        action.payload,
        E.fold<string, authApi.AccessToken, actions.LS<State>>(
          err => ({ ...state, nextToken: RD.failure(err) }),
          token => {
            const nextActions = state.deferredTasks.map(t =>
              cmd(() =>
                R.observable.map(t.task(token), result => t.action(result)),
              ),
            );
            return automaton.loop(
              {
                currentToken: token,
                deferredTasks: [],
                ...state,
              },
              ...nextActions,
            );
          },
        ),
      );
    }
  }
  return state;
};
