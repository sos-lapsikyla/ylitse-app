import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import * as mentorApi from '../../api/mentors';
import * as state from '../../state';
import * as actions from '../../state/actions';

import Background from '../components/Background';
import { textShadow } from '../components/shadow';
import Message from '../components/Message';
import MentorListComponent from '../components/MentorList';
import colors from '../components/colors';
import fonts from '../components/fonts';

import { MentorCardExpandedRoute } from './MentorCardExpanded';

export type MentorListRoute = {
  'Main/MentorList': {};
};

type StateProps = {
  mentors: state.AppState['mentors'];
};
type DispatchProps = {
  fetchMentors: () => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<
  MentorListRoute,
  MentorCardExpandedRoute
>;
type Props = StateProps & DispatchProps & OwnProps;

const MentorList = (props: Props) => {
  const onPressMentor = (mentor: mentorApi.Mentor) => {
    props.navigation.navigate('Main/MentorCardExpanded', { mentor });
  };
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
          onPress={onPressMentor}
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
  state.AppState
>(
  ({ mentors }) => ({ mentors }),

  (dispatch: redux.Dispatch<actions.Action>) => ({
    fetchMentors: () => {
      dispatch(actions.creators.fetchMentors([]));
    },
  }),
)(MentorList);
