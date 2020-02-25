import * as RD from '@devexperts/remote-data-ts';
import * as option from 'fp-ts/lib/Option';

import * as taggedUnion from '../lib/tagged-union';
import * as remoteData from '../lib/remote-data';
import * as record from '../lib/record';
import * as err from '../lib/http-err';
import * as result from '../lib/result';

import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as mentorsApi from '../api/mentors';
import * as messageApi from '../api/messages';

import * as actions from './actions';
import * as requestAction from './actions/request';

export type Pollable<A> = remoteData.RemoteData<
  [A, Exclude<remoteData.RemoteData<unknown, err.Err>, remoteData.Ok<unknown>>],
  err.Err
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
        remoteData.RemoteData<authApi.AccessToken, err.Err>,
        remoteData.Ok<unknown>
      >,
    ]
  >;
  buddies: Pollable<record.NonTotal<buddyApi.Buddy>>;
  mentors: RD.RemoteData<err.Err, record.NonTotal<mentorsApi.Mentor>>;
  messages: Pollable<messageApi.Threads>;
  sendMessage: record.NonTotal<remoteData.RemoteData<undefined, err.Err>>;
};
