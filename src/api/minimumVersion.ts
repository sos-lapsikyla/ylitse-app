import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';

import * as http from '../lib/http';

import * as config from './config';

const clientVersions = t.strict({
  ylitse_ios: t.string,
  ylitse_android: t.string,
});

const versionsResponse = t.strict({
  resources: clientVersions,
});

export type ClientVersions = t.TypeOf<typeof clientVersions>;

export const fetchVersions: () => TE.TaskEither<string, ClientVersions> = () =>
  http.validateResponse(
    http.get(`${config.baseUrl}/version/clients`),
    versionsResponse,
    response => response.resources,
  );
