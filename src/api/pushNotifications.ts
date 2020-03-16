import RN from 'react-native';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { Lazy, constant } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/boolean';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import * as firebase from 'react-native-firebase';

import * as http from '../lib/http';
import * as err from '../lib/http-err';

import * as config from './config';
import * as authApi from './auth';

export const fromPromise: <A>(
  a: Lazy<Promise<A>>,
) => RE.ObservableEither<err.Err, A> = a =>
  pipe(
    TE.tryCatch(a, (reason: unknown) => err.reasonError(reason)),
    RE.fromTaskEither,
  );

export const checkIfHasPermission = fromPromise(() =>
  firebase.messaging().hasPermission(),
);

export const requestPermission = fromPromise(() =>
  firebase.messaging().requestPermission(),
);

export const getDeviceToken = fromPromise(() =>
  firebase.messaging().getToken(),
);

export const requestPermissions = RE.observableEither.chain(
  checkIfHasPermission,
  fold(constant(requestPermission), constant(RE.right(undefined))),
);

export const putDeviceToken = (accessToken: authApi.AccessToken) =>
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
