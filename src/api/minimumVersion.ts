import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';

import * as http from '../lib/http';

import * as config from './config';
import * as authApi from './auth';
import { ValidVersion } from '../lib/validators';

const client = t.strict({
  client: t.string,
  version: ValidVersion,
});

type Client = t.TypeOf<typeof client>;

const clientVersions = t.array(client);

const versionsResponse = t.strict({
  resources: clientVersions,
});

export type Version = {
  client: string;
  major: number;
  minor: number;
  patch: number;
};

const toAppVersion = (value: Client): Version => {
  const splitted = value.version.split('.').map(Number);

  return {
    client: value.client,
    major: splitted[0],
    minor: splitted[1],
    patch: splitted[2],
  };
};

export const fetchVersions = (
  token: authApi.AccessToken,
): TE.TaskEither<string, Array<Version>> =>
  http.validateResponse(
    http.get(`${config.baseUrl}/version/clients`, {
      headers: authApi.authHeader(token),
    }),
    versionsResponse,
    response => response.resources.map(toAppVersion),
  );
