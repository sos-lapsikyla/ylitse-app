import * as reduxHelpers from '../lib/redux-helpers';
import * as http from '../lib/http';
import * as remoteData from '../lib/remote-data';

import * as mentorsApi from '../api/mentors';

import * as actions from './actions';

export type Mentors = remoteData.RemoteData<
  Map<string, mentorsApi.Mentor>,
  http.Err
>;
export type State = {
  mentors: Mentors;
};

export const initialState = remoteData.notAsked;

export const get = ({ mentors }: State) => mentors;

export const reducer = reduxHelpers.makeReducer(
  mentorsApi.fetchMentors,
  actions.mentors,
  'fetchMentors',
  'fetchMentorsCompleted',
  'fetchMentorsReset',
);
