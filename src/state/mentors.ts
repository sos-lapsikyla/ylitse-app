import * as reduxHelpers from '../lib/redux-helpers';
import * as http from '../lib/http';
import * as remoteData from '../lib/remote-data';
import * as record from '../lib/record';

import * as mentorsApi from '../api/mentors';

import * as actions from './actions';

export type State = remoteData.RemoteData<
  record.NonTotal<mentorsApi.Mentor>,
  http.Err
>;

export const initialState = remoteData.notAsked;

export const reducer = reduxHelpers.makeReducer(
  mentorsApi.fetchMentors,
  actions.mentors,
  'fetchMentors',
  'fetchMentorsCompleted',
  'fetchMentorsReset',
);
