import * as stateHandlers from '../lib/state-handlers';
import * as mentorsApi from '../api/mentors';

export const { actions, reducer } = stateHandlers.makeRemoteDataStateHandlers(
  mentorsApi.fetchMentors,
  'fetchMentors',
  'fetchMentorsFailed',
  'fetchMentorsSucceed',
);
