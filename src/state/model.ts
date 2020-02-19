import * as taggedUnion from '../lib/tagged-union';
import * as retryable from '../lib/remote-data-retryable';
import * as remoteData from '../lib/remote-data';
import * as record from '../lib/record';
import * as http from '../lib/http';
import * as option from '../lib/option';

import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as mentorsApi from '../api/mentors';
import * as messageApi from '../api/messages';

import * as actions from './actions';

type Pollable<A> = retryable.Retryable<
  [A, Exclude<retryable.Retryable<unknown, http.Err>, remoteData.Ok<unknown>>],
  http.Err
>;

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
};
