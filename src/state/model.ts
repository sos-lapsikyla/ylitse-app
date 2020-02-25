import * as option from 'fp-ts/lib/Option';

import * as taggedUnion from '../lib/tagged-union';
import * as remoteData from '../lib/remote-data';
import * as record from '../lib/record';
import * as http from '../lib/http';
import * as result from '../lib/result';

import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as mentorsApi from '../api/mentors';
import * as messageApi from '../api/messages';

import * as actions from './actions';
import * as requestAction from './actions/request';

export type Pollable<A> = remoteData.RemoteData<
  [
    A,
    Exclude<remoteData.RemoteData<unknown, http.Err>, remoteData.Ok<unknown>>,
  ],
  http.Err
>;

type Req =
  | {
      request: requestAction.Payload;
      type: 'Loading' | 'Retrying';
    }
  | {
      request: requestAction.Payload;
      type: 'WaitingForAccessToken';
      err: result.Err<any>;
    };

export type AppState = {
  scheduler: Partial<
    {
      [K in actions.Action['type']]: {
        action: taggedUnion.Pick<actions.Action, K>;
        delay: number;
        isLooping: boolean;
      };
    }
  >;
  request: record.NonTotal<Req>;
  accessToken: option.Option<
    [
      authApi.AccessToken,
      Exclude<
        remoteData.RemoteData<authApi.AccessToken, http.Err>,
        remoteData.Ok<unknown>
      >,
    ]
  >;
  buddies: Pollable<record.NonTotal<buddyApi.Buddy>>;
  mentors: remoteData.RemoteData<record.NonTotal<mentorsApi.Mentor>, http.Err>;
  messages: Pollable<messageApi.Threads>;
  sendMessage: record.NonTotal<remoteData.RemoteData<undefined, http.Err>>;
};
