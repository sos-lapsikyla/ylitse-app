import * as RD from '@devexperts/remote-data-ts';
import * as O from 'fp-ts/lib/Option';

import * as err from '../lib/http-err';

import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as mentorsApi from '../api/mentors';
import * as messageApi from '../api/messages';

import * as actions from './actions';

export type AppState = {
  accessToken: O.Option<{
    currentToken: authApi.AccessToken;
    nextToken:
      | { type: 'NotAsked' }
      | { type: 'Loading'; deferred: actions.Action[] };
  }>;
  buddies: RD.RemoteData<err.Err, Record<string, buddyApi.Buddy>>;
  mentors: RD.RemoteData<err.Err, Record<string, mentorsApi.Mentor>>;
  login: RD.RemoteData<err.Err, authApi.AccessToken>;
  createUser: RD.RemoteData<err.Err, authApi.AccessToken>;
  messages: RD.RemoteData<err.Err, messageApi.Threads>;
  sendMessage: Record<string, RD.RemoteData<err.Err, undefined>>;
  markMessageSeen: Record<string, 'Requested'>;
};
