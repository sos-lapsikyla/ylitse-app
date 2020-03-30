import * as E from 'fp-ts/lib/Either';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';

import * as accountApi from '../../api/account';
import * as notificationsApi from '../../api/notifications';
import * as mentorApi from '../../api/mentors';
import * as authApi from '../../api/auth';
import * as buddyApi from '../../api/buddies';
import * as messageApi from '../../api/messages';

type RegularActions = {
  nothing: any;

  'storage/readToken/start': undefined;
  'storage/readToken/end': E.Either<string, authApi.AccessToken>;
  'storage/writeToken/start': authApi.AccessToken;
  'storage/writeToken/end': undefined;

  'mentors/start': undefined;
  'mentors/end': Result<typeof mentorApi.fetchMentors>;

  'login/start': authApi.Credentials;
  'login/end': Result<typeof authApi.login>;

  'createUser/start': accountApi.User;
  'createUser/end': Result<typeof accountApi.createUser>;

  'userAccount/get/start': undefined;
  'userAccount/get/completed': Result<typeof accountApi.getMyUser>;

  'changePassword/start': authApi.NewPassword;
  'changePassword/completed': Result<ReturnType<typeof authApi.changePassword>>;
  'changePassword/reset': undefined;

  'changeEmail/start': { email?: string };
  'changeEmail/completed': E.Either<string, { email?: string }>;
  'changeEmail/reset': undefined;

  'token/Acquired': authApi.AccessToken;
  'token/refresh/start': undefined;
  'token/refresh/end': Result<typeof authApi.refreshAccessToken>;

  'token/doRequest/init': {
    task: (token: authApi.AccessToken) => any;
    action: (result: any) => Action;
  };
  'token/doRequest/completed': {
    index: string;
    result: any;
  };

  'token/refresh/required': (token: authApi.AccessToken) => Action;

  'messages/get/completed': Result<typeof messageApi.fetchMessages>;
  'messages/markSeen': { buddyId: string; messageId: string };

  'buddies/completed': Result<typeof buddyApi.fetchBuddies>;

  'sendMessage/start': messageApi.SendMessageParams;
  'sendMessage/end': {
    buddyId: string;
    response: Result<ReturnType<typeof messageApi.sendMessage>>;
  };

  'notifications/requestPermissions/init': undefined;
  'notifications/requestPermissions/completed': RE2E<
    typeof notificationsApi.requestPermissions
  >;
  'notifications/sendDeviceToken/init': undefined;
  'notifications/sendDeviceToken/completed': Result<
    typeof notificationsApi.sendDeviceToken
  >;
};

// TODO name plz.
type RE2E<T> = T extends RE.ObservableEither<infer E, infer A>
  ? E.Either<E, A>
  : never;

// TODO: handle curried case, Exists under the name "FinalReturn" in
// git history somewhere, use git log -S
type Result<F extends (...args: any[]) => any> = RE2E<ReturnType<F>>;
// https://github.com/microsoft/TypeScript/issues/23182
//type Payload<T> = [T] extends [never] ? {} : { payload: T };
export type ActionType = keyof RegularActions;
export type Action = {
  [Type in ActionType]: {
    type: Type;
    payload: RegularActions[Type];
  };
}[ActionType];

export function make<T extends ActionType, P extends RegularActions[T]>(
  type: T,
): (
  payload: P,
) => {
  type: T;
  payload: P;
} {
  return (payload: P) => ({ type, payload });
}
