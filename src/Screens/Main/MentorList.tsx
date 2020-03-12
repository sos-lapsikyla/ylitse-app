import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import * as mentorApi from '../../api/mentors';

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

type OwnProps = navigationProps.NavigationProps<
  MentorListRoute,
  MentorCardExpandedRoute
>;
type Props = OwnProps;

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
        <MentorListComponent onPress={onPressMentor} />
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
    ...fonts.titleLarge,
    ...textShadow,
    color: colors.white,
  },
  bottomSeparator: {
    height: 96,
  },
});

export default MentorList;
