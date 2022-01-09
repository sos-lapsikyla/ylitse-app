import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import * as http from '../lib/http';
import * as validators from '../lib/validators';

import * as authApi from './auth';
import * as config from './config';

const filterSkillStat = t.interface({
  name: t.literal('filter_skills'),
  props: t.strict({ skills: t.array(t.string) }),
});

const openMentorStat = t.interface({
  name: t.literal('open_mentor_profile'),
  props: t.strict({ mentor_id: t.string }),
});

const stat = t.union([filterSkillStat, openMentorStat]);

export type Stat = t.TypeOf<typeof stat>;

export const sendStat = (stat: Stat) => (token: authApi.AccessToken) => {
  const url = `${config.baseUrl}/events/`;

  return http.validateResponse(
    http.post(url, stat, {
      headers: authApi.authHeader(token),
    }),
    t.unknown,
    _ => true,
  );
};
