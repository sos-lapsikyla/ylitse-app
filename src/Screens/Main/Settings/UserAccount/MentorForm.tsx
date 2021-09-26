import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as RD from '@devexperts/remote-data-ts';
import * as selector from '../../../../state/selectors';

import * as config from '../../../../api/config';
import * as actions from '../../../../state/actions';
import { coolDownDuration as statusMessageStateCooldown } from '../../../../state/reducers/changeStatusMessage';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

import AlertBox from './AlertBox';
import AlertDialog from './AlertDialog';
import Button from '../../../components/Button';
import Message from '../../../components/Message';
import StatusMessageForm from 'src/Screens/components/StatusMessageForm';
import MessageSwitch from 'src/Screens/components/MessageSwitch';

type Props = {
  userId: string;
};

export default ({ userId }: Props) => {
  const { mentor, account, changeStatusMessageState, isVacationStatusLoading } =
    useSelector(selector.getMentorFormData(userId));

  const [statusMessage, setStatusMessage] = React.useState(
    mentor?.status_message ?? '',
  );

  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const openProfile = () => {
    RN.Linking.openURL(config.loginUrl);
  };

  const changeVacationStatus = () => {
    if (typeof mentor !== 'undefined' && typeof account !== 'undefined') {
      dispatch({
        type: 'mentor/changeVacationStatus/start',
        payload: { mentor, account },
      });
    }
  };

  const changeStatusMessage = () => {
    if (typeof mentor !== 'undefined' && typeof account !== 'undefined') {
      const updated = { ...mentor, status_message: statusMessage };
      dispatch({
        type: 'mentor/changeStatusMessage/start',
        payload: { mentor: updated, account },
      });
    }
  };

  const resetStatusMessage = () => {
    dispatch({
      type: 'mentor/changeStatusMessage/reset',
      payload: undefined,
    });
  };

  React.useEffect(() => {
    if (RD.isSuccess(changeStatusMessageState)) {
      const timeout = setTimeout(
        resetStatusMessage,
        statusMessageStateCooldown,
      );

      return () => clearTimeout(timeout);
    }
  }, [changeStatusMessageState]);

  React.useEffect(() => {
    setStatusMessage(mentor?.status_message ?? '');
  }, [mentor?.status_message]);

  return (
    <>
      <Message
        style={styles.fieldName}
        id="main.settings.account.profile.title"
      />
      <Button
        style={styles.changePasswordButton}
        messageStyle={styles.buttonText}
        onPress={openProfile}
        messageId="main.settings.account.profile.button"
      />
      <Message
        style={styles.fieldName}
        id="main.settings.account.vacation.title"
      />
      <MessageSwitch
        messageOn="main.settings.account.vacation.on"
        messageOff="main.settings.account.vacation.off"
        value={mentor?.is_vacationing ?? false}
        onPress={changeVacationStatus}
        isLoading={isVacationStatusLoading}
      />
      <Message
        style={styles.fieldName}
        id="main.settings.account.status.title"
        testID="main.settings.account.status.title"
      />
      {pipe(
        changeStatusMessageState,
        RD.fold(
          () => (
            <StatusMessageForm
              statusMessage={statusMessage}
              setStatusMessage={setStatusMessage}
              onButtonPress={changeStatusMessage}
              maxLength={30}
              isLoading={false}
            />
          ),
          () => (
            <StatusMessageForm
              statusMessage={statusMessage}
              setStatusMessage={setStatusMessage}
              onButtonPress={changeStatusMessage}
              maxLength={30}
              isLoading={true}
            />
          ),
          () => (
            <AlertDialog
              imageStyle={styles.failBox}
              imageSource={require('../../../images/alert-circle.svg')}
              messageId="main.settings.account.status.fail"
              onOkPress={resetStatusMessage}
              onRetryPress={changeStatusMessage}
            />
          ),
          () => (
            <AlertBox
              imageStyle={styles.successBox}
              imageSource={require('../../../images/checkmark-circle-outline.svg')}
              duration={statusMessageStateCooldown}
              messageId="main.settings.account.status.success"
            />
          ),
        ),
      )}
    </>
  );
};

const styles = RN.StyleSheet.create({
  fieldName: {
    ...fonts.regular,
    color: colors.blueGray,
    marginTop: 16,
  },
  changePasswordButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.blue,
  },
  buttonText: {
    ...fonts.regularBold,
    // ...textShadow,
    color: colors.white,
  },
  failBox: {
    tintColor: colors.danger,
  },
  successBox: {
    tintColor: colors.darkBlue,
  },
});
