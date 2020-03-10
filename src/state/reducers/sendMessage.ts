import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as R from 'fp-ts-rxjs/lib/Observable';
import * as record from 'fp-ts/lib/Record';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { constant, flow } from 'fp-ts/lib/function';

import * as messageApi from '../../api/messages';
import * as err from '../../lib/http-err';

import * as actions from '../actions';
import * as model from '../model';
import { withToken } from './accessToken';

type Request = RD.RemoteData<err.Err, undefined>;

export type State = model.AppState['sendMessage'];
export const reducer = (state: State, action: actions.Action) => {
  switch (action.type) {
    case 'sendMessage/start':
      const buddyId = action.payload.buddyId;
      const isLoading = pipe(
        record.lookup(buddyId, state),
        O.fold(constant(false), RD.isPending),
      );
      const nextState = record.insertAt<string, Request>(
        action.payload.buddyId,
        RD.pending,
      )(state);
      return isLoading
        ? state
        : automaton.loop(
            nextState,
            withToken(
              flow(
                messageApi.sendMessage(action.payload),
                R.map(response => ({ response, buddyId })),
                R.map(actions.make('sendMessage/end')),
              ),
            ),
          );
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
