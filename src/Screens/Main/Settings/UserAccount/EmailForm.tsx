import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import * as O from 'fp-ts/lib/Option';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import * as changeEmailState from '../../../../state/reducers/changeEmail';
import * as accountState from '../../../../state/reducers/userAccount';
import * as actions from '../../../../state/actions';

import NamedInputField from '../../../components/NamedInputField';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import colors, { gradients } from '../../../components/colors';
import fonts from '../../../components/fonts';
import { textShadow } from '../../../components/shadow';
import Message from '../../../components/Message';

import AlertBox from './AlertBox';

type Props = {
  onClose: () => void | undefined;
};

export default ({ onClose }: Props) => {
  const account = RD.toOption(useSelector(accountState.getAccount));
  const storedEmail = pipe(
    account,
    O.map(({ email }) => email),
    O.toUndefined,
  );

  const [email, setEmail] = React.useState(storedEmail || '');

  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  const onButtonPress = () => {
    dispatch(
      changeEmailState.changeEmail({ email, account: O.toUndefined(account) }),
    );
  };

  const requestState = useSelector(changeEmailState.select);

  React.useEffect(() => {
    if (RD.isSuccess(requestState)) {
      setEmail(requestState.value.email || '');
      const timeout = setTimeout(onClose, changeEmailState.coolDownDuration);
      return () => clearTimeout(timeout);
    }
  }, [requestState]);
  return (
    <RN.View style={styles.container}>
      <Message style={styles.title} id="main.settings.account.email.title" />
      {pipe(
        requestState,
        RD.fold(
          () => (
            <>
              <NamedInputField
                style={styles.field}
                name="main.settings.account.email.title"
                value={email}
                onChangeText={setEmail}
                testID="main.settings.account.email.input"
              />
              <RN.View style={styles.buttonContainer}>
                <Button
                  style={styles.cancelButton}
                  messageStyle={styles.cancelButtonText}
                  onPress={onClose}
                  messageId="meta.cancel"
                  gradient={gradients.faintGray}
                  testID="main.settings.account.email.cancel"
                />
                <Button
                  style={styles.changePasswordButton}
                  messageStyle={styles.buttonText}
                  onPress={onButtonPress}
                  messageId="meta.save"
                  gradient={gradients.pillBlue}
                  testID="main.settings.account.email.save"
                />
              </RN.View>
            </>
          ),
          () => <Spinner style={styles.spinner} />,
          () => (
            <AlertBox
              imageStyle={styles.failBox}
              imageSource={require('../../../images/alert-circle.svg')}
              duration={changeEmailState.coolDownDuration}
              messageId="main.settings.account.email.fail"
            />
          ),
          () => (
            <AlertBox
              imageStyle={styles.successBox}
              imageSource={require('../../../images/checkmark-circle-outline.svg')}
              duration={changeEmailState.coolDownDuration}
              messageId="main.settings.account.email.success"
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
  },
  cancelButtonText: {
    ...fonts.large,
    color: colors.deepBlue,
  },
  changePasswordButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexGrow: 1,
  },
  buttonText: {
    ...fonts.largeBold,
    ...textShadow,
    color: colors.white,
  },
});
