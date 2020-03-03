import * as RD from '@devexperts/remote-data-ts';
import * as O from 'fp-ts/lib/Option';

import * as record from '../lib/record';
import * as err from '../lib/http-err';

import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as mentorsApi from '../api/mentors';
import * as messageApi from '../api/messages';

export type AppState = {
  accessToken: O.Option<authApi.AccessToken>;
  buddies: RD.RemoteData<err.Err, record.NonTotal<buddyApi.Buddy>>;
  mentors: RD.RemoteData<err.Err, record.NonTotal<mentorsApi.Mentor>>;
  messages: RD.RemoteData<err.Err, messageApi.Threads>;
  sendMessage: record.NonTotal<RD.RemoteData<err.Err, undefined>>;
  login: RD.RemoteData<err.Err, authApi.AccessToken>;
  createUser: RD.RemoteData<err.Err, authApi.AccessToken>;
};
