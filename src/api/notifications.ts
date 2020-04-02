import RN from 'react-native';
import * as t from 'io-ts';
import { fold } from 'fp-ts/lib/boolean';
import * as TE from 'fp-ts/lib/TaskEither';
import * as firebase from 'react-native-firebase';

import * as http from '../lib/http';

import * as config from './config';
import * as authApi from './auth';

const checkIfHasPermission = TE.tryCatch(
  () => firebase.messaging().hasPermission(),
  () => 'Has permissions threw.',
);

const requestPermission = TE.tryCatch(
  () => firebase.messaging().requestPermission(),
  () => 'Permissions requesting threw.',
);

const getDeviceToken = TE.tryCatch(
  () => firebase.messaging().getToken(),
  () => 'Get token threw.',
);

export const requestPermissions = TE.taskEither.chain(
  checkIfHasPermission,
  fold(
    () => TE.taskEither.chain(requestPermission, () => checkIfHasPermission),
    () => TE.right(true),
  ),
);

export const sendDeviceToken = (accessToken: authApi.AccessToken) =>
  TE.taskEither.chain(getDeviceToken, deviceToken =>
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
