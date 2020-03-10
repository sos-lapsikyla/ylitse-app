import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import * as state from '../../../state/reducers/changePassword';
import * as actions from '../../../state/actions';

import NamedInputField from '../../components/NamedInputField';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import colors, { gradients } from '../../components/colors';
import fonts from '../../components/fonts';
import { textShadow } from '../../components/shadow';

export default () => {
  const [currentPass, setCurrentPass] = React.useState('');
  const [newPass, setNewPass] = React.useState('');
  const [repeatedNewPass, setRepeatedNewPass] = React.useState('');

  const isOkay =
    currentPass.length > 0 &&
    newPass.length > 0 &&
    repeatedNewPass.length > 0 &&
    newPass === repeatedNewPass;

  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  const changePassword = () => {
    dispatch({
      type: 'changePassword/start',
      payload: {
        currentPassword: currentPass,
        newPassword: newPass,
      },
    });
  };

  const requestState = useSelector(state.select);

  React.useEffect(() => {
    if (RD.isSuccess(requestState)) {
      setCurrentPass('');
      setNewPass('');
      setRepeatedNewPass('');
    }
  }, [requestState]);
  return pipe(
    requestState,
    RD.fold(
      () => (
        <RN.View style={styles.container}>
          <NamedInputField
            style={styles.field}
            name="main.settings.account.currentPassword"
            isPasswordInput={true}
            value={currentPass}
            onChangeText={setCurrentPass}
          />
          <NamedInputField
            style={styles.field}
            name="main.settings.account.newPassword"
            isPasswordInput={true}
            value={newPass}
            onChangeText={setNewPass}
          />
          <NamedInputField
            style={styles.field}
            name="main.settings.account.newPasswordRepeat"
            isPasswordInput={true}
            value={repeatedNewPass}
            onChangeText={setRepeatedNewPass}
          />
          <Button
            style={styles.changePasswordButton}
            messageStyle={styles.buttonText}
            onPress={changePassword}
            messageId="main.settings.account.changePasswordButton"
            gradient={gradients.pillBlue}
            disabled={!isOkay}
          />
        </RN.View>
      ),
      () => <Spinner />,
      () => null,
      () => null,
    ),
  );
};

const styles = RN.StyleSheet.create({
  container: {
    marginTop: 16,
  },
  field: {
    marginVertical: 8,
  },
  changePasswordButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    ...fonts.largeBold,
    ...textShadow,
    color: colors.white,
  },
});
