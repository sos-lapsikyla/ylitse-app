import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import * as config from '../../../../api/config';
import * as actions from '../../../../state/actions';
import * as mentorState from '../../../../state/reducers/mentors';

import Button from '../../../components/Button';
import Message from '../../../components/Message';
import Spinner from '../../../components/Spinner';
import { Toast } from '../../../components/Toast';
import AlertDialog from './AlertDialog';
import StatusMessageForm from 'src/Screens/components/StatusMessageForm';
import MessageSwitch from 'src/Screens/components/MessageSwitch';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

type Props = {
  userId: string;
};

export default ({ userId }: Props) => {
  const { mentor, account, isMentorDataUpdateLoading } = useSelector(
    mentorState.getMentorFormData(userId),
  );

  const [statusMessage, setStatusMessage] = React.useState(
    mentor?.status_message ?? '',
  );

  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const openProfile = () => {
    RN.Linking.openURL(config.loginUrl);
  };

  const changeVacationStatus = () => {
    if (!!mentor && !!account) {
      const updated = { ...mentor, is_vacationing: !mentor.is_vacationing };
      dispatch({
        type: 'mentor/updateMentorData/start',
        payload: { mentor: updated, account },
      });
    }
  };

  const changeStatusMessage = () => {
    if (!!mentor && !!account) {
      const updated = { ...mentor, status_message: statusMessage };
      dispatch({
        type: 'mentor/updateMentorData/start',
        payload: { mentor: updated, account },
      });
    }
  };

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
        containerStyle={styles.vacationSwitch}
        value={mentor?.is_vacationing ?? false}
        isLoading={isMentorDataUpdateLoading}
        messageOn="main.settings.account.vacation.on"
        messageOff="main.settings.account.vacation.off"
        onPress={changeVacationStatus}
        testID="main.settings.
          account.vacation.switch"
      />
      <Message
        style={styles.fieldName}
        id="main.settings.account.status.title"
        testID="main.settings.account.status.title"
      />
      {pipe(
        statusMessageState,
        RD.fold(
          () => (
            <StatusMessageForm
              statusMessage={statusMessage}
              setStatusMessage={setStatusMessage}
              onButtonPress={changeStatusMessage}
              maxLength={30}
            />
          ),
          () => <Spinner />,
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
            <Toast
              toastType="success"
              duration={changeStatusMessageState.coolDownDuration}
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
    color: colors.white,
  },
  failBox: {
    tintColor: colors.danger,
  },
  vacationSwitch: { marginTop: 8 },
});
