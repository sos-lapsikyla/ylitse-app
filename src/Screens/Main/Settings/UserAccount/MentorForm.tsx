import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as RD from '@devexperts/remote-data-ts';
import * as selector from '../../../../state/selectors';

import * as config from '../../../../api/config';
import * as actions from '../../../../state/actions';
import * as mentorState from '../../../../state/reducers/mentors';
import * as changeStatusMessageState from '../../../../state/reducers/changeStatusMessage';

import Button from '../../../components/Button';
import Message from '../../../components/Message';
import ToggleSwitch from '../../../components/ToggleSwitch';
import Spinner from '../../../components/Spinner';
import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

import AlertBox from './AlertBox';
import StatusMessageForm from 'src/Screens/components/StatusMessageForm';

type Props = {
  userId: string;
};

export default ({ userId }: Props) => {
  const mentor = useSelector(mentorState.getMentorByUserId(userId));

  const [statusMessage, setStatusMessage] = React.useState(
    mentor?.status_message ?? '',
  );

  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const isLoading = useSelector(selector.getIsChangeVacationStatusLoading);

  const requestState = useSelector(selector.getStatusMessage);

  const openProfile = () => {
    RN.Linking.openURL(config.loginUrl);
  };

  const changeVacationStatus = () => {
    if (typeof mentor !== 'undefined') {
      dispatch({
        type: 'mentor/changeVacationStatus/start',
        payload: { mentor },
      });
    }
  };

  const changeStatusMessage = () => {
    if (typeof mentor !== 'undefined') {
      dispatch({
        type: 'mentor/changeStatusMessage/start',
        payload: { statusMessage, mentor },
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
    if (RD.isSuccess(requestState)) {
      const timeout = setTimeout(
        resetStatusMessage,
        changeStatusMessageState.coolDownDuration,
      );

      return () => clearTimeout(timeout);
    }
  }, [requestState]);

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
      {isLoading ? (
        <Spinner />
      ) : (
        <ToggleSwitch
          value={mentor?.is_vacationing ?? false}
          messageOn="main.settings.account.vacation.on"
          messageOff="main.settings.account.vacation.off"
          toggleSwitch={changeVacationStatus}
          testID="main.settings.
          account.vacation.switch"
        />
      )}
      <Message
        style={styles.fieldName}
        id="main.settings.account.status.title"
        testID="main.settings.account.status.title"
      />
      {pipe(
        requestState,
        RD.fold(
          () => (
            <StatusMessageForm
              statusMessage={statusMessage}
              setStatusMessage={setStatusMessage}
              onButtonPress={changeStatusMessage}
            />
          ),
          () => <Spinner />,
          () => (
            <AlertBox
              imageStyle={styles.failBox}
              imageSource={require('../../../images/alert-circle.svg')}
              duration={changeStatusMessageState.coolDownDuration}
              messageId="main.settings.account.status.fail"
            />
          ),
          () => (
            <AlertBox
              imageStyle={styles.successBox}
              imageSource={require('../../../images/checkmark-circle-outline.svg')}
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
