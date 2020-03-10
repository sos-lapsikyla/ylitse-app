import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import * as mentorApi from '../../api/mentors';

import MentorTitle from '../components/MentorTitle';
import MentorStory from '../components/MentorStory';
import MentorSkills from '../components/MentorSkills';
import Button from '../components/Button';
import { gradients } from '../components/colors';

import { ChatRoute } from './Chat';

export type MentorCardExpandedRoute = {
  'Main/MentorCardExpanded': { mentor: mentorApi.Mentor };
};

type OwnProps = navigationProps.NavigationProps<
  MentorCardExpandedRoute,
  ChatRoute
>;

type Props = OwnProps;

const MentorCardExpanded = ({ navigation }: Props) => {
  const mentor = navigation.getParam('mentor');
  const goBack = () => {
    navigation.goBack();
  };
  const navigateToChat = () => {
    navigation.navigate('Main/Chat', { buddyId: mentor.buddyId });
  };
  return (
    <LinearGradient style={styles.container} colors={gradients.whitegray}>
      <MentorTitle
        style={styles.mentorTitle}
        mentor={mentor}
        onPress={goBack}
        safeArea={true}
      />
      <RN.ScrollView contentContainerStyle={styles.scrollContent}>
        <MentorStory style={styles.story} story={mentor.story} showAll={true} />
        <MentorSkills
          style={styles.skills}
          skills={mentor.skills}
          showAll={true}
        />
        <SafeAreaView style={styles.safeArea} forceInset={{ bottom: 'always' }}>
          <Button
            style={styles.button}
            onPress={navigateToChat}
            messageId="main.mentorCardExpanded.button"
          />
        </SafeAreaView>
      </RN.ScrollView>
    </LinearGradient>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  mentorTitle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
    justifyContent: 'space-evenly',
    flexGrow: 1,
    paddingBottom: 40,
  },
  story: {
    marginTop: 24,
  },
  skills: {
    marginTop: 24,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: 24,
    marginHorizontal: 24,
  },
});

export default MentorCardExpanded;
