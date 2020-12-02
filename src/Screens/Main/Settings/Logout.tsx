import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../../lib/navigation-props';
import * as actions from '../../../state/actions';

import Message from '../../components/Message';
import { textShadow } from '../../components/shadow';
import ScreenTitle from '../../components/ScreenTitle';
import colors from '../../components/colors';
import fonts from '../../components/fonts';
import MessageButton from '../../components/MessageButton';
import CreatedBySosBanner from '../../components/CreatedBySosBanner';

import { MentorListRoute } from '../../Onboarding/MentorList';
import navigateOnboarding from './navigateOnboarding';

export type LogoutRoute = {
  'Main/Settings/Logout': {};
};

type Props = navigationProps.NavigationProps<LogoutRoute, MentorListRoute>;

export default ({ navigation }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  const onLogout = () => {
    dispatch(actions.make('logout/logout')(undefined));
    navigateOnboarding(navigation);
  };
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
        testID={'main.settings.logout.view'}
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
            testID="main.settings.logout.logout"
          />
          <MessageButton
            style={styles.cancelButton}
            onPress={onGoBack}
            messageId={'main.settings.logout.cancel'}
            testID="main.settings.logout.cancel"
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
