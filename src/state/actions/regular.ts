import * as E from 'fp-ts/lib/Either';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';

import * as accountApi from '../../api/account';
import * as mentorApi from '../../api/mentors';
import * as authApi from '../../api/auth';
import * as buddyApi from '../../api/buddies';
import * as messageApi from '../../api/messages';

type RegularActions = {
  'mentors/start': never;
  'mentors/completed': Result<typeof mentorApi.fetchMentors>;

  'login/start': authApi.Credentials;
  'login/completed': Result<typeof authApi.login>;

  'createUser/start': accountApi.NewUser;
  'createUser/completed': Result<typeof accountApi.createUser>;

  'token/Acquired': authApi.AccessToken;
  'token/refresh/start': never;
  'token/refresh/completed': Result<typeof authApi.refreshAccessToken>;

  'messages/start': never;
  'messages/completed': Result<typeof messageApi.fetchMessages>;

  'buddies/completed': Result<typeof buddyApi.fetchBuddies>;

  'sendMessage/start': messageApi.SendMessageParams;
  'sendMessage/completed': {
    buddyId: string;
    response: Result<typeof messageApi.sendMessage>;
  };
};

type Result<F extends (...args: any[]) => any> = ReturnType<
  F
> extends RE.ObservableEither<infer E, infer A>
  ? E.Either<E, A>
  : never;

// https://github.com/microsoft/TypeScript/issues/23182
type Payload<T> = [T] extends [never] ? {} : { payload: T };
export type ActionType = keyof RegularActions;
export type Actions = {
  [Type in ActionType]: {
    type: Type;
  } & Payload<RegularActions[Type]>;
}[ActionType];
