import RN from 'react-native';
import * as t from 'io-ts';
import { fold } from 'fp-ts/lib/boolean';
import * as TE from 'fp-ts/lib/TaskEither';
import messaging from '@react-native-firebase/messaging';

import * as http from '../lib/http';

import * as config from './config';
import * as authApi from './auth';

// Get rid of warning about not having handler attached
messaging().setBackgroundMessageHandler(async _ => {});

const checkIfHasPermission = TE.tryCatch(
  () =>
    messaging()
      .hasPermission()
      .then(authStatus => {
        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      }),
  () => 'Has permissions threw.',
);

const requestPermission = TE.tryCatch(
  () => messaging().requestPermission(),
  () => 'Permissions requesting threw.',
);

const getDeviceToken = TE.tryCatch(
  () => messaging().getToken(),
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
