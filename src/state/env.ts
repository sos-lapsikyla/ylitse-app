import * as authApi from '../api/auth';
import * as messageApi from '../api/messages';
import * as buddyApi from '../api/buddies';

export type Env = {
  sendMessage: (
    token: authApi.AccessToken,
  ) => (
    params: messageApi.SendMessageParams,
  ) => ReturnType<typeof messageApi.sendMessage>;
  fetchBuddies: (
    token: authApi.AccessToken,
  ) => () => ReturnType<typeof buddyApi.fetchBuddies>;
};
