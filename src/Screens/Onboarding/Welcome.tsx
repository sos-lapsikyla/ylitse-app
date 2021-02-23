import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import Card from '../components/Card';
import SosBanner from '../components/CreatedBySosBanner';
import AppTitle from '../components/AppTitle';
import Message from '../components/Message';
import MessageButton from '../components/MessageButton';
import fonts from '../components/fonts';
import colors from '../components/colors';

import { MentorListRoute } from './MentorList';

export type WelcomeRoute = {
  'Onboarding/Welcome': {};
};

type Props = navigationProps.NavigationProps<WelcomeRoute, MentorListRoute>;

export default ({ navigation }: Props) => {
  const navigateNext = () => {
    navigation.navigate('Onboarding/MentorList', {});
  };

  return (
    <SafeAreaView
      forceInset={{ top: 'always', bottom: 'always' }}
      style={styles.background}
    >
      <RN.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        testID={'onboarding.welcome.view'}
      >
        <AppTitle style={styles.appTitle} />
        <Card style={styles.card}>
          <Message style={styles.titleText} id={'onboarding.welcome.title'} />
          <Message style={styles.text} id={'onboarding.welcome.text1'} />
          <Message style={styles.text} id={'onboarding.welcome.text2'} />
          <Message style={styles.text} id={'onboarding.welcome.text3'} />
          <MessageButton
            style={styles.button}
            messageStyle={styles.buttonText}
            messageId={'onboarding.welcome.button'}
            onPress={navigateNext}
            testID="onboarding.welcome.button"
          />
        </Card>
        <SosBanner style={styles.banner} />
      </RN.ScrollView>
    </SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  background: {
    backgroundColor: colors.lightBlue,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scroll: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  card: {
    marginTop: 32,
    paddingHorizontal: 24,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  appTitle: {
    marginTop: 40,
    alignSelf: 'center',
    zIndex: 1,
  },
  banner: {
    alignSelf: 'center',
    color: colors.white,
    marginBottom: 16,
  },
  titleText: {
    marginTop: 40,
    ...fonts.largeBold,
    textAlign: 'center',
    marginBottom: 32,
  },
  text: {
    ...fonts.regularBold,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    alignSelf: 'center',
    paddingHorizontal: 40,
    marginBottom: 32,
  },
  buttonText: {
    ...fonts.largeBold,
    color: colors.black,
    textAlign: 'center',
  },
});
