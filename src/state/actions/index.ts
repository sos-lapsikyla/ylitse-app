import * as automaton from 'redux-automaton';

import * as regular from './regular';
import * as epic from './epic';

export const mentors = regular.mentors;

export type RegularAction = regular.Action;
export type EpicAction = epic.FetchCmd;
export type Action = regular.Action | epic.FetchCmd;

export const creators = {
  ...regular.creators,
  fetchCmd: epic.fetchCmd,
};

export type LS<S> = S | automaton.Loop<S, Action>;
export type Reducer<S> = (state: S | undefined, action: Action) => LS<S>;
