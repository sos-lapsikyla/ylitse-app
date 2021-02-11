import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import * as mentorApi from '../../api/mentors';

import Background from '../components/Background';
import { textShadow } from '../components/shadow';
import MentorsTitleAndSearchButton from '../components/MentorsTitleAndSearchButton';
import MentorListComponent from '../components/MentorList';
import colors from '../components/colors';
import fonts from '../components/fonts';

import { MentorCardExpandedRoute } from './MentorCardExpanded';
import { SearchMentorRoute } from '../Main/SearchMentor';

export type MentorListRoute = {
  'Main/MentorList': {};
};

type OwnProps = navigationProps.NavigationProps<
  MentorListRoute,
  MentorCardExpandedRoute & SearchMentorRoute
>;
type Props = OwnProps;

const MentorList = (props: Props) => {
  const onPressMentor = (mentor: mentorApi.Mentor) => {
    props.navigation.navigate('Main/MentorCardExpanded', { mentor });
  };

  const onPressSearchMentor = () => {
    props.navigation.navigate('Main/SearchMentor', {});
  };

  return (
    <Background>
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: 'always', bottom: 'always' }}
      >
        <MentorsTitleAndSearchButton
          id="main.mentorList.title"
          onPress={onPressSearchMentor}
        />
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
