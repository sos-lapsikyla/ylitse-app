import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { pipe } from 'fp-ts/lib/pipeable';
import * as RD from '@devexperts/remote-data-ts';

import * as navigationProps from '../../../lib/navigation-props';
import * as actions from '../../../state/actions';
import * as selector from '../../../state/selectors';
import * as state from '../../../state/reducers/changePassword';

import Message from '../../components/Message';
import Button from '../../components/Button';
import { textShadow } from '../../components/shadow';
import ScreenTitle from '../../components/ScreenTitle';
import colors from '../../components/colors';
import fonts from '../../components/fonts';
import CreatedBySosBanner from '../../components/CreatedBySosBanner';
import Spinner from '../../components/Spinner';

import { MentorListRoute } from '../../Onboarding/MentorList';
import NamedInputField from '../../components/NamedInputField';

import AlertBox from './UserAccount/AlertBox';

export type PasswordChangeRoute = {
  'Main/Settings/PasswordChange': {};
};

type Props = navigationProps.NavigationProps<
  PasswordChangeRoute,
  MentorListRoute
>;

export default ({ navigation }: Props) => {
  const account = useSelector(selector.getAccount)

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [repeatedNewPassword, setRepeatedNewPassword] = React.useState('');
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const isOkay =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    repeatedNewPassword.length > 0 &&
    newPassword === repeatedNewPassword;

  const onGoBack = () => {
    navigation.goBack();
  };
  const onButtonPress = () => {
    dispatch(state.changePassword({ currentPassword, newPassword }));
  };
  const requestState = useSelector(state.select);

  React.useEffect(() => {
    if (RD.isSuccess(requestState)) {
      setCurrentPassword('');
      setNewPassword('');
      setRepeatedNewPassword('');
      const timeout = setTimeout(onGoBack, state.coolDownDuration);
      return () => clearTimeout(timeout);
    }
  }, [requestState]);
  
  return (
    <RN.View style={styles.screen}>
      <ScreenTitle
        id="main.settings.account.password.title"
        onBack={onGoBack}
      />
      <RN.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID={'main.settings.password.view'}
      >
        <SafeAreaView
          forceInset={{ bottom: 'always' }}
          style={styles.buttonContainer}
        >
          <Message
            style={styles.title}
            id="main.settings.account.password.title"
          />
          <Message
            style={styles.fieldName}
            id="main.settings.account.userName"
          />
          <RN.Text style={styles.fieldValueText}>{account?.userName}</RN.Text>
          {pipe(
            requestState,
            RD.fold(
              () => (
                <>
                  <NamedInputField
                    style={styles.field}
                    name="main.settings.account.password.current"
                    isPasswordInput={true}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    testID="main.settings.account.password.current"
                  />
                  <NamedInputField
                    style={styles.field}
                    name="main.settings.account.password.new"
                    isPasswordInput={true}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    testID="main.settings.account.password.new"
                  />
                  <NamedInputField
                    style={styles.field}
                    name="main.settings.account.password.repeat"
                    isPasswordInput={true}
                    value={repeatedNewPassword}
                    onChangeText={setRepeatedNewPassword}
                    testID="main.settings.account.password.repeat"
                  />
                  <RN.View style={styles.buttonContainer}>
                    <Button
                      style={styles.cancelButton}
                      messageStyle={styles.cancelButtonText}
                      onPress={onGoBack}
                      messageId="meta.cancel"
                      testID="main.settings.account.password.cancel"
                    />
                    <Button
                      style={styles.changePasswordButton}
                      messageStyle={styles.buttonText}
                      onPress={onButtonPress}
                      messageId="meta.save"
                      disabled={!isOkay}
                      testID="main.settings.account.password.save"
                    />
                  </RN.View>
                </>
              ),
              () => <Spinner style={styles.spinner} />,
              () => (
                <AlertBox
                  imageStyle={styles.failBox}
                  imageSource={require('../../images/alert-circle.svg')}
                  duration={state.coolDownDuration}
                  messageId="main.settings.account.password.failure"
                />
              ),
              () => (
                <AlertBox
                  imageStyle={styles.successBox}
                  imageSource={require('../../images/checkmark-circle-outline.svg')}
                  duration={state.coolDownDuration}
                  messageId="main.settings.account.password.success"
                />
              ),
            ),
          )}
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
    ...fonts.titleBold,
    color: colors.darkestBlue,
  },
  field: {
    marginVertical: 10,
  },
  fieldName: {
    ...fonts.regular,
    color: colors.blueGray,
    marginTop: 16,
  },
  fieldValueText: {
    ...fonts.largeBold,
    color: colors.darkestBlue,
  },
  scrollView: {
    zIndex: 1,
  },
  cancelButtonText: {
    ...fonts.large,
    color: colors.darkestBlue,
  },
  changePasswordButton: {
    backgroundColor: colors.blue,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  spinner: {
    alignSelf: 'center',
  },
  failBox: {
    tintColor: colors.danger,
  },
  successBox: {
    tintColor: colors.darkBlue,
  },
  buttonContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginVertical: 24,
  },
  buttonText: {
    ...fonts.largeBold,
    ...textShadow,
    color: colors.white,
  },
  cancelButton: { backgroundColor: colors.gray, marginBottom: 16 },
});
