import * as remoteData from '../lib/remote-data';

import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as mentorsApi from '../api/mentors';

export type State = {
  accessToken: remoteData.RemoteData<authApi.AccessToken>;
  mentors: remoteData.RemoteData<Map<string, mentorsApi.Mentor>>;
  buddies: remoteData.RemoteData<buddyApi.Buddy[]>;
};

export const initialState: State = {
  accessToken: remoteData.notAsked,
  mentors: remoteData.notAsked,
  buddies: remoteData.notAsked,
};
