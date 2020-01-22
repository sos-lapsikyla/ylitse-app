import * as remoteData from '../lib/remote-data';
import * as mentorsApi from '../api/mentors';
// import * as authApi from '../api/auth';

export type State = Onboarding;

export const initialState = {
  mentors: remoteData.notAsked,
};

type Onboarding = {
  mentors: remoteData.RemoteData<Map<string, mentorsApi.Mentor>>;
};

// type State = {
//   mentors: remoteData.RemoteData<Map<string, mentorsApi.Mentor>>;
//   accessToken: remoteData.RemoteData<authApi.AccessToken>;
// };
