import * as mentorsApi from '../api/mentors';
import * as messageApi from '../api/messages';
import * as buddyApi from '../api/buddies';
import * as authApi from '../api/auth';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';

export type Deps = typeof deps;
export const deps = {
  fetchMentors: () => RE.fromTaskEither(mentorsApi.fetchMentors()),
  login: (creds: authApi.Credentials) =>
    RE.fromTaskEither(authApi.login(creds)),
  fetchMessages: (token: authApi.AccessToken) =>
    RE.fromTaskEither(messageApi.fetchMessages(token)),
  fetchBuddies: (token: authApi.AccessToken) =>
    RE.fromTaskEither(buddyApi.fetchBuddies(token)),
};
