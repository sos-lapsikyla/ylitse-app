/* global Response */
import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';

import * as actions from '../actions';

import {AppState} from '../types';

export const initialState = RD.initial;
export const reducer: automaton.Reducer<
  RD.RemoteData<string, Response>,
  actions.Action
> = (state = initialState, action) => {
  switch (action.type) {

    default:
      return state;
  }
};

export const select = ({updateMentorData: state}: AppState) => state;
