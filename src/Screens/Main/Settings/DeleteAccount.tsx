import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import * as actions from '../../../state/actions';
import * as navigationProps from '../../../lib/navigation-props';

import Message from '../../components/Message';
import { textShadow } from '../../components/shadow';
import ScreenTitle from '../../components/ScreenTitle';
import colors from '../../components/colors';
import fonts from '../../components/fonts';
import MessageButton from '../../components/MessageButton';
import CreatedBySosBanner from '../../components/CreatedBySosBanner';

import { MentorListRoute } from '../../Onboarding/MentorList';
import navigateOnboarding from './navigateOnboarding';

export type DeleteAccountRoute = {
  'Main/Settings/DeleteAccount': {};
};

type Props = navigationProps.NavigationProps<
  DeleteAccountRoute,
  MentorListRoute
>;

export default ({ navigation }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const onDeleteAccount = () => {
    dispatch(actions.make('deleteAccount/start')(undefined));
    navigateOnboarding(navigation);
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  return (
    <RN.View style={styles.screen}>
      <ScreenTitle
        style={styles.title}
        id="main.settings.deleteAccount.title"
        onBack={onGoBack}
      />
      <RN.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID={'main.settings.deleteAccount.view'}
      >
        <RN.View />
        <RN.View style={styles.textContainer}>
          <Message
            style={styles.text}
            id={'main.settings.deleteAccount.text1'}
          />
          <Message
            style={styles.text}
            id={'main.settings.deleteAccount.text2'}
          />
          <Message
            style={styles.text}
            id={'main.settings.deleteAccount.text3'}
          />
        </RN.View>
        <SafeAreaView
          forceInset={{ bottom: 'always' }}
          style={styles.buttonContainer}
        >
          <MessageButton
            style={styles.deleteAccountButton}
            onPress={onDeleteAccount}
            messageId={'main.settings.deleteAccount.deleteAccount'}
            testID={'main.settings.deleteAccount.deleteAccount'}
          />
          <MessageButton
            style={styles.cancelButton}
            onPress={onGoBack}
            messageId={'main.settings.deleteAccount.cancel'}
            testID={'main.settings.deleteAccount.cancel'}
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
  title: {
    backgroundColor: colors.danger,
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
    color: colors.darkestBlue,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
  },
  deleteAccountButton: { backgroundColor: colors.danger, marginBottom: 40 },
  cancelButton: { backgroundColor: colors.gray, marginBottom: 40 },
});
