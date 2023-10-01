import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch } from 'react-redux';
import * as actions from '../../../state/actions';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from 'src/Screens';

import Message from '../../components/Message';
import { textShadow } from '../../components/shadow';
import ScreenTitle from '../../components/ScreenTitle';
import colors from '../../components/colors';
import fonts from '../../components/fonts';
import MessageButton from '../../components/MessageButton';
import CreatedBySosBanner from '../../components/CreatedBySosBanner';

export type DeleteAccountRoute = {
  'Main/Settings/DeleteAccount': {};
};

type Props = StackScreenProps<StackRoutes, 'Main/Settings/DeleteAccount'>;

export default ({ navigation }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const onDeleteAccount = () => {
    dispatch(actions.make('deleteAccount/start')(undefined));
    navigation.reset({ routes: [{ name: 'Onboarding/MentorList' }] });
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
        <SafeAreaView style={styles.buttonContainer}>
          <MessageButton
            style={[styles.button, styles.deleteButton]}
            messageStyle={styles.deleteButtonText}
            onPress={onDeleteAccount}
            messageId={'main.settings.deleteAccount.deleteAccount'}
            testID={'main.settings.deleteAccount.deleteAccount'}
          />
          <MessageButton
            style={styles.button}
            onPress={onGoBack}
            messageId={'main.settings.deleteAccount.cancel'}
            testID={'main.settings.deleteAccount.cancel'}
            emphasis="low"
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
    backgroundColor: colors.red,
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
  button: { marginBottom: 40 },
  deleteButton: { backgroundColor: colors.lightDanger },
  deleteButtonText: {
    color: colors.danger,
  },
});
