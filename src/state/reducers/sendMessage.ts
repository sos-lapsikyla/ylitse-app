import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import * as record from 'fp-ts/lib/Record';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { constant } from 'fp-ts/lib/function';

import * as messageApi from '../../api/messages';

import * as actions from '../actions';
import * as model from '../model';
import { withToken } from './accessToken';

type Request = RD.RemoteData<string, undefined>;

export type State = model.AppState['sendMessage'];
export const reducer = (state: State, action: actions.Action) => {
  switch (action.type) {
    case 'sendMessage/start':
      const buddyId = action.payload.buddyId;
      const isLoading = pipe(
        record.lookup(buddyId, state),
        O.fold(constant(false), RD.isPending),
      );

      if (isLoading) {
        return state;
      }

      const nextState = record.insertAt<string, Request>(
        action.payload.buddyId,
        RD.pending,
      )(state);
      const nextAction = withToken(
        token =>
          T.task.map(
            messageApi.sendMessage(action.payload)(token),
            response => ({ response, buddyId }),
          ),
        actions.make('sendMessage/end'),
      );
      return automaton.loop(nextState, nextAction);
    case 'sendMessage/end':
      return pipe(
        state,
        record.insertAt<string, Request>(
          action.payload.buddyId,
          pipe(
            action.payload.response,
            E.fold(RD.failure, constant(RD.initial)),
          ),
        ),
      );
    default:
      return state;
  }
};
