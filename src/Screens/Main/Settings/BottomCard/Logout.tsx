import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch } from 'react-redux';
import * as actions from '../../../../state/actions';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from 'src/Screens';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

import Message from '../../../components/Message';
import ScreenTitle from '../../../components/ScreenTitle';
import MessageButton from '../../../components/MessageButton';
import CreatedBySosBanner from '../../../components/CreatedBySosBanner';
import IconButton from '../../../components/IconButton';

export type LogoutRoute = {
  'Main/Settings/Logout': {};
};

type Props = StackScreenProps<StackRoutes, 'Main/Settings/Logout'>;

export default ({ navigation }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const onLogout = () => {
    dispatch(actions.make('logout/logout')(undefined));
    navigation.reset({ routes: [{ name: 'Onboarding/MentorList' }] });
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
        <SafeAreaView style={styles.bottomContainer}>
          <RN.View style={styles.buttonContainer}>
            <IconButton
              style={styles.button}
              onPress={onGoBack}
              testID="main.settings.logout.cancel"
              badge={require('../../../images/chevron-left.svg')}
              badgeStyle={styles.badge}
            />
            <MessageButton
              style={[styles.button, styles.logoutButton]}
              onPress={onLogout}
              testID="main.settings.logout.logout"
              messageId={'main.settings.logout.logout'}
            />
          </RN.View>
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
  scrollView: {
    zIndex: 1,
    marginTop: -32,
    paddingHorizontal: 24,
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
    color: colors.darkestBlue,
    textAlign: 'center',
    marginBottom: 40,
  },
  bottomContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: { marginBottom: 40 },
  logoutButton: { paddingHorizontal: 64 },
  badge: {
    width: 32,
    height: 32,
  },
});
