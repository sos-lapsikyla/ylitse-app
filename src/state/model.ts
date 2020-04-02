import * as RD from '@devexperts/remote-data-ts';
import * as O from 'fp-ts/lib/Option';

import * as authApi from '../api/auth';
import * as accountApi from '../api/account';
import * as buddyApi from '../api/buddies';
import * as mentorsApi from '../api/mentors';
import * as messageApi from '../api/messages';

export type AppState = {
  storage: {
    readToken: RD.RemoteData<string, authApi.AccessToken>;
    writeToken: RD.RemoteData<string, void>;
  };

  accessToken: {
    currentToken: O.Option<authApi.AccessToken>;
    nextToken: RD.RemoteData<string, authApi.AccessToken>;
    index: number;
    tasks: Record<string, { task: any; action: any }>;
    deferredTasks: { task: any; action: any }[];
  };

  login: RD.RemoteData<string, authApi.AccessToken>;
  createUser: RD.RemoteData<string, authApi.AccessToken>;
  changePassword: RD.RemoteData<string, undefined>;
  changeEmail: RD.RemoteData<string, { email?: string }>;
  userAccount: RD.RemoteData<string, accountApi.UserAccount>;

  mentors: RD.RemoteData<string, Record<string, mentorsApi.Mentor>>;
  buddies: RD.RemoteData<string, Record<string, buddyApi.Buddy>>;
  messages: {
    polling: boolean;
    messages: RD.RemoteData<string, messageApi.Threads>;
  };
  sendMessage: Record<string, RD.RemoteData<string, undefined>>;
  markMessageSeen: Record<string, boolean>;
  notifications: {
    requestPermissions: RD.RemoteData<string, boolean>;
    sendDeviceToken: RD.RemoteData<string, undefined>;
  };
};
