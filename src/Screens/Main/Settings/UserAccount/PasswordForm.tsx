import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import * as state from '../../../../state/reducers/changePassword';
import * as actions from '../../../../state/actions';

import NamedInputField from '../../../components/NamedInputField';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import colors from '../../../components/colors';
import fonts from '../../../components/fonts';
import { textShadow } from '../../../components/shadow';
import Message from '../../../components/Message';

import AlertBox from './AlertBox';

type Props = {
  onClose: () => void | undefined;
};

export default ({ onClose }: Props) => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [repeatedNewPassword, setRepeatedNewPassword] = React.useState('');

  const isOkay =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    repeatedNewPassword.length > 0 &&
    newPassword === repeatedNewPassword;

  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  const onButtonPress = () => {
    dispatch(state.changePassword({ currentPassword, newPassword }));
  };

  const requestState = useSelector(state.select);

  React.useEffect(() => {
    if (RD.isSuccess(requestState)) {
      setCurrentPassword('');
      setNewPassword('');
      setRepeatedNewPassword('');
      const timeout = setTimeout(onClose, state.coolDownDuration);
      return () => clearTimeout(timeout);
    }
  }, [requestState]);
  return (
    <RN.View style={styles.container}>
      <Message style={styles.title} id="main.settings.account.password.title" />
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
                  onPress={onClose}
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
              imageSource={require('../../../images/alert-circle.svg')}
              duration={state.coolDownDuration}
              messageId="main.settings.account.password.failure"
            />
          ),
          () => (
            <AlertBox
              imageStyle={styles.successBox}
              imageSource={require('../../../images/checkmark-circle-outline.svg')}
              duration={state.coolDownDuration}
              messageId="main.settings.account.password.success"
            />
          ),
        ),
      )}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    minHeight: 320,
    justifyContent: 'center',
  },
  title: {
    ...fonts.titleBold,
    color: colors.deepBlue,
    marginBottom: 24,
  },
  spinner: {
    alignSelf: 'center',
  },
  failBox: {
    tintColor: colors.danger,
  },
  successBox: {
    tintColor: colors.blue100,
  },
  field: {
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  cancelButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    marginRight: 16,
    backgroundColor: colors.faintGray
  },
  cancelButtonText: {
    ...fonts.large,
    color: colors.deepBlue,
  },
  changePasswordButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexGrow: 1,
    backgroundColor: colors.pillBlue
  },
  buttonText: {
    ...fonts.largeBold,
    ...textShadow,
    color: colors.white,
  },
});
