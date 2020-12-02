import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import * as mentorApi from '../../api/mentors';

import MentorTitle from '../components/MentorTitle';
import MentorStory from '../components/MentorStory';
import Skills from '../components/Skills';
import Message from '../components/Message';
import getBuddyColor from '../components/getBuddyColor';
import Button from '../components/Button';
import colors, { gradients } from '../components/colors';
import fonts from '../components/fonts';

import { ChatRoute } from './Chat';

const langMap: Record<string, RN.ImageSourcePropType> = {
  Finnish: require('../images/flags/fi.svg'),
  Italian: require('../images/flags/it.svg'),
  English: require('../images/flags/gb.svg'),
  Swedish: require('../images/flags/se.svg'),
  Russian: require('../images/flags/ru.svg'),
};

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
  const color = getBuddyColor(mentor.buddyId);
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
      <RN.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        testID={'main.mentorCardExpanded.view'}
      >
        <RN.View style={styles.flagContainer}>
          {mentor.languages.map(lang =>
            lang in langMap ? (
              <RN.Image
                style={styles.flag}
                key={lang}
                source={langMap[lang]}
                width={48}
                height={48}
              />
            ) : null,
          )}
        </RN.View>
        <Message id={'main.mentor.story'} style={styles.subtitle} />
        <MentorStory style={styles.story} story={mentor.story} showAll={true} />
        <Skills style={styles.skills} color={color} skills={mentor.skills} />
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
  flagContainer: {
    alignSelf: 'stretch',
    marginTop: 32,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flag: {
    borderRadius: 24,
    marginRight: 16,
  },
  subtitle: {
    ...fonts.largeBold,
    color: colors.deepBlue,
    textAlign: 'left',
  },
  story: {
    marginTop: 16,
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
