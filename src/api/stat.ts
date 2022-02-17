import * as http from '../lib/http';

import * as authApi from './auth';
import * as config from './config';

type FilterSkillStat = {
  name: 'filter_skills';
  props: Record<'skills', Array<string>>;
};

type OpenMentorStat = {
  name: 'open_mentor_profile';
  props: Record<'mentor_id', string>;
};

export type Stat = FilterSkillStat | OpenMentorStat;

export const sendStat = (stat: Stat) => (token: authApi.AccessToken) => {
  const url = `${config.baseUrl}/events`;

  return http.post(url, [stat], {
    headers: authApi.authHeader(token),
  });
};
