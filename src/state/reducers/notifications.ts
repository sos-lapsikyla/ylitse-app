import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/boolean';

import * as notificationsApi from '../../api/notifications';

import { cmd } from '../middleware';
import { withToken } from './accessToken';
import * as actions from '../actions';
import { AppState } from '../types';

type RequestPermissions = AppState['notifications']['requestPermissions'];
type SendDeviceToken = AppState['notifications']['sendDeviceToken'];

const sendDeviceTokenInit = actions.make('notifications/sendDeviceToken/init')(
  undefined,
);

const sendDeviceToken = withToken(
  notificationsApi.sendDeviceToken,
  actions.make('notifications/sendDeviceToken/completed'),
);

type RequestPermissionsLoop =
  | automaton.Loop<RequestPermissions, actions.Action>
  | RequestPermissions;

export const reducer = automaton.combineReducers({
  requestPermissions: requestPermissionReducer,
  sendDeviceToken: sendDeviceTokenReducer,
});

export const initialState: AppState['notifications'] = {
  requestPermissions: RD.initial,
  sendDeviceToken: RD.initial,
};

export function requestPermissionReducer(
  state: RequestPermissions,
  action: actions.Action,
) {
  switch (action.type) {
    case 'token/Acquired':
      return automaton.loop(
        RD.pending,
        cmd(
          pipe(
            notificationsApi.requestPermissions,
            T.map(actions.make('notifications/requestPermissions/completed')),
          ),
        ),
      );
    case 'notifications/requestPermissions/completed':
      return pipe(
        action.payload,
        E.fold(
          RD.failure,
          fold<RequestPermissionsLoop>(
            () => RD.success(false),
            () => automaton.loop(RD.success(true), sendDeviceTokenInit),
          ),
        ),
      );
    default:
      return state;
  }
}

export function sendDeviceTokenReducer(
  state: SendDeviceToken,
  action: actions.Action,
) {
  switch (action.type) {
    case 'notifications/sendDeviceToken/init':
      return automaton.loop(RD.pending, sendDeviceToken);
    case 'notifications/sendDeviceToken/completed':
      return RD.fromEither(action.payload);
    default:
      return state;
  }
}
