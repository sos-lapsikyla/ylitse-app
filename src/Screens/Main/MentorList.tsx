import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as redux from 'redux';
import { useDispatch } from 'react-redux';
import * as actions from '../../state/actions';

import * as mentorApi from '../../api/mentors';

import Background from '../components/Background';
import { textShadow } from '../components/shadow';
import MentorsTitleAndSearchButton from '../components/MentorsTitleAndSearchButton';
import MentorListComponent from '../components/MentorList';
import colors from '../components/colors';
import fonts from '../components/fonts';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabRoutes } from './Tabs';

export type MentorListRoute = {
  'Main/MentorList': {};
};

type OwnProps = CompositeScreenProps<
  BottomTabScreenProps<TabRoutes, 'Main/MentorList'>,
  StackScreenProps<StackRoutes>
>;

type Props = OwnProps;

const MentorList = (props: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const onPressMentor = (mentor: mentorApi.Mentor) => {
    props.navigation.navigate('Main/MentorCardExpanded', {
      mentor,
      didNavigateFromChat: false,
    });

    dispatch({
      type: 'statRequest/start',
      payload: {
        name: 'open_mentor_profile',
        props: { mentor_id: mentor.mentorId },
      },
    });
  };

  const onPressSearchMentor = () => {
    props.navigation.navigate('Main/SearchMentor', {});
  };

  return (
    <Background>
      <SafeAreaView style={styles.container}>
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
