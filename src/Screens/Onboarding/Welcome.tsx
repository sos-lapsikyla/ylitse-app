import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import * as config from '../../api/config';
import useLayout from '../../lib/use-layout';

import Card from '../components/Card';
import SosBanner from '../components/CreatedBySosBanner';
import AppTitle from '../components/AppTitle';
import Message from '../components/Message';
import Link from '../components/Link';
import MessageButton from '../components/MessageButton';
import fonts from '../components/fonts';
import colors from '../components/colors';

export type WelcomeRoute = {
  'Onboarding/Welcome': {};
};

type Props = StackScreenProps<StackRoutes, 'Onboarding/Welcome'>;

export default ({ navigation }: Props) => {
  const navigateNext = () => {
    navigation.navigate('Onboarding/MentorList', {});
  };

  const [{ width, height }, onLayout] = useLayout();

  return (
    <SafeAreaView style={styles.background} onLayout={onLayout}>
      <RN.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        testID={'onboarding.welcome.view'}
      >
        <AppTitle style={[styles.appTitle, { width, height: height / 6 }]} />
        <Card style={styles.card}>
          <Message style={styles.titleText} id={'onboarding.welcome.title'} />
          <Message style={styles.text} id={'onboarding.welcome.text1'} />
          <Message style={styles.text} id={'onboarding.welcome.text2'} />
          <Message style={styles.text} id={'onboarding.welcome.text3'} />
          <RN.View>
            <Message style={styles.text} id={'onboarding.welcome.text4'} />
            <Link
              style={styles.link}
              linkTextStyle={styles.linkText}
              linkIconStyle={styles.linkIcon}
              linkName="onboarding.welcome.apuu.link"
              url={config.apuuUrl}
            />
          </RN.View>
          <RN.View>
            <Message style={styles.text} id={'onboarding.welcome.text5'} />
            <Link
              style={styles.link}
              linkTextStyle={styles.linkText}
              linkIconStyle={styles.linkIcon}
              linkName="onboarding.welcome.sekasin.link"
              url={config.sekasinUrl}
            />
          </RN.View>
          <Message style={styles.text} id={'onboarding.welcome.text6'} />
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
    backgroundColor: colors.purple,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
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
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    marginHorizontal: 24,
    marginVertical: 32,
  },
  appTitle: {
    alignSelf: 'center',
    zIndex: 1,
  },
  banner: {
    alignSelf: 'center',
    color: colors.white,
    marginBottom: 16,
  },
  titleText: {
    ...fonts.titleLargeBold,
    textAlign: 'center',
    color: colors.darkestBlue,
  },
  text: {
    ...fonts.regularBold,
    textAlign: 'center',
    color: colors.darkestBlue,
  },
  link: {
    alignSelf: 'center',
  },
  linkText: {
    ...fonts.smallBold,
  },
  linkIcon: {
    width: 20,
    height: 20,
  },
  button: {
    alignSelf: 'center',
    paddingHorizontal: 60,
  },
  buttonText: {
    ...fonts.largeBold,
    textAlign: 'center',
  },
});
