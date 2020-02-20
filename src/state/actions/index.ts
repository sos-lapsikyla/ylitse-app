import * as reduxLoop from 'redux-loop';

import * as taggedUnion from '../../lib/tagged-union';

import * as regular from './regular';
import * as scheduler from './scheduler';
import * as request from './request';

export const mentors = regular.mentors;

export type Action = regular.Action | scheduler.Action | request.Action;

// export type Action = actionType.ActionsUnion<
//   keyof typeof creators,
//   typeof creators
// >;
export const creators = {
  ...regular.creators,
  ...scheduler.creators,
  ...request.creators,
};

export type LS<S> = S | reduxLoop.Loop<S, Action>;
export type Reducer<S> = (state: S | undefined, action: Action) => LS<S>;

export function match<S>(state: S, action: Action) {
  return (matchers: Partial<taggedUnion.MatcherRecord<Action, LS<S>>>) =>
    taggedUnion.match<Action, LS<S>>(action, {
      ...matchers,
      default() {
        return state;
      },
    });
}
