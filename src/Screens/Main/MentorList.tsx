import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';
import * as remoteData from '../../lib/remote-data';

import * as mentorApi from '../../api/mentors';
import * as state from '../../state';

import Background from '../components/Background';
import { textShadow } from '../components/shadow';
import Message from '../components/Message';
import MentorListComponent from '../components/MentorList';
import colors from '../components/colors';
import fonts from '../components/fonts';

export type MentorListRoute = {
  'Main/MentorList': {};
};

type StateProps = {
  mentors: remoteData.RemoteData<Map<string, mentorApi.Mentor>>;
};
type DispatchProps = {
  fetchMentors: () => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<
  MentorListRoute,
  MentorListRoute
>;
type Props = StateProps & DispatchProps & OwnProps;

const MentorList = (props: Props) => {
  return (
    <Background>
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: 'always', bottom: 'always' }}
      >
        <Message style={styles.title} id="main.mentorList.title" />
        <MentorListComponent
          mentors={props.mentors}
          fetchMentors={props.fetchMentors}
          onPress={() => {}}
        />
        <RN.View style={styles.bottomSeparator} />
      </SafeAreaView>
    </Background>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: 24,
    marginBottom: 8,
    ...fonts.specialTitle,
    ...textShadow,
    color: colors.white,
  },
  bottomSeparator: {
    height: 96,
  },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.State
>(
  ({ mentors }) => ({ mentors }),

  (dispatch: redux.Dispatch<state.Action>) => ({
    fetchMentors: () => {
      dispatch(state.actions.fetchMentors([]));
    },
  }),
)(MentorList);
