import * as reduxHelpers from '../lib/redux-helpers';
import * as remoteData from '../lib/remote-data';

import * as mentorsApi from '../api/mentors';

import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['mentors'];

export const initialState = remoteData.notAsked;

export const reducer = reduxHelpers.makeReducer(
  mentorsApi.fetchMentors,
  actions.mentors,
  'fetchMentors',
  'fetchMentorsCompleted',
  'fetchMentorsReset',
);
