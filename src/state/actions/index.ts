import * as automaton from 'redux-automaton';

import * as taggedUnion from '../../lib/tagged-union';

import * as regular from './regular';
import * as epic from './epic';

export const mentors = regular.mentors;

export type RegularAction = regular.Action;
export type Action = regular.Action | epic.FetchCmd;

export const creators = {
  ...regular.creators,
  fetchCmd: epic.fetchCmd,
};

export type Pick<K extends Action['type']> = taggedUnion.Pick<Action, K>;

export type LS<S> = S | automaton.Loop<S, Action>;
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
