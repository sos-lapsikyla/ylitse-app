import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../../lib/navigation-props';

import Message from '../../components/Message';
import { textShadow } from '../../components/shadow';
import ScreenTitle from '../../components/ScreenTitle';
import colors from '../../components/colors';
import fonts from '../../components/fonts';
import MessageButton from '../../components/MessageButton';
import CreatedBySosBanner from '../../components/CreatedBySosBanner';

export type LogoutRoute = {
  'Main/Settings/Logout': {};
};

type Props = navigationProps.NavigationProps<LogoutRoute, LogoutRoute>;

export default ({ navigation }: Props) => {
  const onLogout = () => {};
  const onGoBack = () => {
    navigation.goBack();
  };
  return (
    <RN.View style={styles.screen}>
      <ScreenTitle id="main.settings.logout.title" onBack={onGoBack} />
      <RN.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RN.View />
        <RN.View style={styles.textContainer}>
          <Message style={styles.text} id={'main.settings.logout.text1'} />
          <Message style={styles.text} id={'main.settings.logout.text2'} />
        </RN.View>
        <SafeAreaView
          forceInset={{ bottom: 'always' }}
          style={styles.buttonContainer}
        >
          <MessageButton
            style={styles.logoutButton}
            onPress={onLogout}
            messageId={'main.settings.logout.logout'}
          />
          <MessageButton
            style={styles.cancelButton}
            onPress={onGoBack}
            messageId={'main.settings.logout.cancel'}
          />
          <CreatedBySosBanner />
        </SafeAreaView>
      </RN.ScrollView>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screenTitleText: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.white,
  },
  scrollView: {
    zIndex: 1,
    marginTop: -32,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 24,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    ...fonts.largeBold,
    color: colors.deepBlue,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
  },
  logoutButton: { marginBottom: 40 },
  cancelButton: { backgroundColor: colors.gray, marginBottom: 40 },
});