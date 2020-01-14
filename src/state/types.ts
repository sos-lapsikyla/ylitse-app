import * as remoteData from '../lib/remote-data';
import * as mentorsApi from '../api/mentors';

export type State = Onboarding;

export const initialState = {
  mentors: remoteData.notAsked,
};

type Onboarding = {
  mentors: remoteData.RemoteData<Map<string, mentorsApi.Mentor>>;
};
