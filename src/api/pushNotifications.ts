import RN from 'react-native';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import * as firebase from 'react-native-firebase';

import * as http from '../lib/http';
import * as err from '../lib/http-err';

import * as config from './config';
import * as authApi from './auth';

export const getDeviceToken = TE.tryCatch(
  () => firebase.messaging().getToken(),
  (reason: unknown) => err.reasonError(reason),
);

export function putDeviceToken(accessToken: authApi.AccessToken) {
  return pipe(
    getDeviceToken,
    RE.fromTaskEither,
    RE.chain(deviceToken =>
      http.validateResponse(
        http.put(
          `${config.baseUrl}/users/${accessToken.userId}/device`,
          { token: deviceToken, platform: RN.Platform.OS },
          { headers: authApi.authHeader(accessToken) },
        ),
        t.unknown,
        _ => undefined,
      ),
    ),
  );
}
