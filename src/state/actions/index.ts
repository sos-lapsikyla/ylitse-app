import * as automaton from 'redux-automaton';

import * as regular from './regular';
import * as middleware from '../middleware';
import * as epic from './epic';

export type RegularAction = regular.Action;
export type Cmd = middleware.Cmd<regular.Action>;
export type EpicAction = epic.FetchCmd;
export type Action = regular.Action | epic.FetchCmd | Cmd;

export type LS<S> = S | automaton.Loop<S, Action>;
export type Reducer<S> = (state: S | undefined, action: Action) => LS<S>;

export const make = regular.make;
