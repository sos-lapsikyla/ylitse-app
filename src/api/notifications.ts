import RN from 'react-native';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { Lazy } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/boolean';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import * as firebase from 'react-native-firebase';

import * as http from '../lib/http';

import * as config from './config';
import * as authApi from './auth';

export const fromPromise: <A>(
  a: Lazy<Promise<A>>,
) => RE.ObservableEither<string, A> = a =>
  pipe(
    TE.tryCatch(a, () => 'Unknown failure on notifications.'),
    RE.fromTaskEither,
  );

const checkIfHasPermission = () =>
  fromPromise(() => firebase.messaging().hasPermission());

const requestPermission = fromPromise(() =>
  firebase.messaging().requestPermission(),
);

const getDeviceToken = fromPromise(() => firebase.messaging().getToken());

export const requestPermissions = RE.observableEither.chain(
  checkIfHasPermission(),
  fold(
    () => RE.observableEither.chain(requestPermission, checkIfHasPermission),
    () => RE.right(true),
  ),
);

export const sendDeviceToken = (accessToken: authApi.AccessToken) =>
  RE.observableEither.chain(getDeviceToken, deviceToken =>
    http.validateResponse(
      http.put(
        `${config.baseUrl}/users/${accessToken.userId}/device`,
        { token: deviceToken, platform: RN.Platform.OS },
        { headers: authApi.authHeader(accessToken) },
      ),
      t.unknown,
      _ => undefined,
    ),
  );
