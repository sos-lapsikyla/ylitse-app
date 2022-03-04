import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import * as mentorApi from '../../api/mentors';
import * as buddyState from '../../state/reducers/buddies';
import { useSelector } from 'react-redux';

import MentorTitle from '../components/MentorTitle';
import MentorStory from '../components/MentorStory';
import Skills from '../components/Skills';
import Message from '../components/Message';
import getBuddyColor from '../components/getBuddyColor';
import Button from '../components/Button';
import colors from '../components/colors';
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
  'Main/MentorCardExpanded': {
    mentor: mentorApi.Mentor;
    didNavigateFromChat: boolean;
  };
};

type OwnProps = navigationProps.NavigationProps<
  MentorCardExpandedRoute,
  ChatRoute
>;

type Props = OwnProps;

const MentorCardExpanded = ({ navigation }: Props) => {
  const mentor = navigation.getParam('mentor');
  const didNavigateFromChat = navigation.getParam('didNavigateFromChat');
  const color = getBuddyColor(mentor.buddyId);
  const isBuddy = useSelector(buddyState.getIsBuddy(mentor.buddyId));
  const shouldNavigateBack = didNavigateFromChat && isBuddy;

  const goBack = () => {
    navigation.goBack();
  };

  const navigateToChat = () => {
    navigation.navigate('Main/Chat', { buddyId: mentor.buddyId });
  };

  const hasStatusMessage = mentor.status_message.length > 0;

  const isChatDisabled = !didNavigateFromChat && mentor.is_vacationing;

  return (
    <RN.View style={styles.container}>
      <MentorTitle
        style={styles.mentorTitle}
        mentor={mentor}
        onPress={goBack}
        safeArea={true}
        withStatus={false}
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
              <RN.Image style={styles.flag} key={lang} source={langMap[lang]} />
            ) : null,
          )}
        </RN.View>
        {hasStatusMessage && (
          <>
            <Message
              id={'main.settings.account.status.title'}
              style={styles.subtitle}
            />
            <RN.View style={styles.statusContainer}>
              <RN.Text style={styles.status}>{mentor.status_message}</RN.Text>
            </RN.View>
          </>
        )}
        <Message id={'main.mentor.story'} style={styles.subtitle} />
        <MentorStory style={styles.story} story={mentor.story} showAll={true} />
        <Skills style={styles.skills} color={color} skills={mentor.skills} />
        <SafeAreaView style={styles.safeArea} forceInset={{ bottom: 'always' }}>
          <Button
            style={styles.button}
            onPress={shouldNavigateBack ? goBack : navigateToChat}
            messageId="main.mentorCardExpanded.button"
            disabled={isChatDisabled}
          />
        </SafeAreaView>
      </RN.ScrollView>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightestGray,
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
    width: 48,
    height: 48,
  },
  subtitle: {
    ...fonts.largeBold,
    color: colors.darkestBlue,
    textAlign: 'left',
  },
  story: {
    marginTop: 16,
  },
  statusContainer: {
    alignSelf: 'stretch',
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  status: {
    ...fonts.regular,
    color: colors.darkestBlue,
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
