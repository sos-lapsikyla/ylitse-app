import * as automaton from 'redux-automaton';
import * as R from 'fp-ts-rxjs/lib/Observable';
import * as RD from '@devexperts/remote-data-ts';
import { flow } from 'fp-ts/lib/function';
import { atRecord } from 'monocle-ts/lib/At/Record';
import * as M from 'monocle-ts';
import * as rx from 'rxjs/operators';
import * as rxjs from 'rxjs';

import * as messageApi from '../api/messages';

import * as actions from './actions';
import * as model from './model';

import { withToken } from './accessToken';

export type State = model.AppState['messages'];
export type LoopState = actions.LS<State>;

export const initialState = RD.initial;

export const message_ = (buddyId: string, messageId: string) =>
  M.Index.fromAt(atRecord<messageApi.Thread>())
    .index(buddyId)
    .compose(M.Index.fromAt(atRecord<messageApi.Message>()).index(messageId));

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'fetchMessages':
      return !RD.isInitial(state)
        ? state
        : automaton.loop(
            RD.pending,
            withToken(
              flow(
                s => rxjs.timer(0, 1000).pipe(rx.map(_ => s)),
                rx.switchMap(s => messageApi.fetchMessages(s)),
                R.map(actions.creators.fetchMessagesCompleted),
              ),
            ),
          );
    case 'fetchMessagesCompleted':
      return RD.fromEither(action.payload);
    default:
      return state;
  }
};
