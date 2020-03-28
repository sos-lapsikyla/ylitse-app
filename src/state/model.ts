import * as RD from '@devexperts/remote-data-ts';
import * as O from 'fp-ts/lib/Option';

import * as authApi from '../api/auth';
import * as accountApi from '../api/account';
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
  login: RD.RemoteData<string, authApi.AccessToken>;
  createUser: RD.RemoteData<string, authApi.AccessToken>;
  changePassword: RD.RemoteData<string, undefined>;
  changeEmail: RD.RemoteData<string, { email?: string }>;
  userAccount: RD.RemoteData<string, accountApi.UserAccount>;

  mentors: RD.RemoteData<string, Record<string, mentorsApi.Mentor>>;
  buddies: RD.RemoteData<string, Record<string, buddyApi.Buddy>>;
  messages: RD.RemoteData<string, messageApi.Threads>;
  sendMessage: Record<string, RD.RemoteData<string, undefined>>;
  markMessageSeen: Record<string, 'Requested'>;

  notifications: {
    requestPermissions: RD.RemoteData<string, boolean>;
    sendDeviceToken: RD.RemoteData<string, undefined>;
  };
};
