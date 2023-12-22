import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { pipe } from 'fp-ts/lib/function';
import * as RD from '@devexperts/remote-data-ts';

import * as config from '../../../../api/config';
import * as actions from '../../../../state/actions';
import * as mentorState from '../../../../state/reducers/mentors';
import * as mentorUpdate from '../../../../state/reducers/updateMentorData';

import Button from '../../../components/Button';
import Message from '../../../components/Message';
import Spinner from '../../../components/Spinner';
import { Toast } from '../../../components/Toast';
import AlertModal from '../../../components/Modal';
import MessageSwitch from '../../../components/MessageSwitch';
import StatusMessageForm from './StatusMessageForm';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

type Props = {
  userId: string;
};

export default ({ userId }: Props) => {
  const { mentor, account } = useSelector(
    mentorState.getMentorFormData(userId),
  );

  const [statusMessage, setStatusMessage] = React.useState(
    mentor?.status_message ?? '',
  );

  const vacationStatusState = useSelector(
    mentorUpdate.selectMentorDataUpdatingStateFor('is_vacationing'),
  );

  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const statusMessageState = useSelector(
    mentorUpdate.selectMentorDataUpdatingStateFor('status_message'),
  );

  const openProfile = () => {
    RN.Linking.openURL(config.loginUrl);
  };

  const updateMentorData = (
    updateData: mentorUpdate.MentorUpdateData,
    updateKey: mentorUpdate.UpdateKey,
  ) => {
    if (!!mentor && !!account) {
      dispatch({
        type: 'mentor/updateMentorData/start',
        payload: {
          mentor: { ...mentor, ...updateData },
          account,
          key: updateKey,
        },
      });
    }
  };

  const resetStatusMessage = () => {
    dispatch({
      type: 'mentor/updateMentorData/reset',
      payload: 'status_message',
    });
  };

  React.useEffect(() => {
    if (RD.isSuccess(statusMessageState)) {
      const timeout = setTimeout(
        resetStatusMessage,
        mentorUpdate.successResetDuration,
      );

      return () => clearTimeout(timeout);
    }
  }, [statusMessageState]);

  React.useEffect(() => {
    setStatusMessage(mentor?.status_message ?? '');
  }, [mentor?.status_message]);

  return (
    <RN.View>
      <RN.View style={styles.dataContainer}>
        <Message
          style={styles.fieldName}
          id="main.settings.account.profile.title"
        />
        <Button
          style={styles.button}
          onPress={openProfile}
          messageId="main.settings.account.profile.button"
        />
      </RN.View>
      <RN.View style={styles.dataContainer}>
        <Message
          style={styles.fieldName}
          id="main.settings.account.vacation.title"
        />
        <MessageSwitch
          containerStyle={styles.vacationSwitch}
          value={mentor?.is_vacationing ?? false}
          isLoading={RD.isPending(vacationStatusState)}
          messageOn="main.settings.account.vacation.on"
          messageOff="main.settings.account.vacation.off"
          onPress={() =>
            updateMentorData(
              { is_vacationing: !mentor?.is_vacationing },
              'is_vacationing',
            )
          }
          testID="main.settings.
          account.vacation.switch"
        />
      </RN.View>
      <RN.View style={styles.dataContainer}>
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
                onButtonPress={() =>
                  updateMentorData(
                    { status_message: statusMessage },
                    'status_message',
                  )
                }
                maxLength={30}
              />
            ),
            () => <Spinner />,
            () => (
              <AlertModal
                title="meta.error"
                modalType="danger"
                messageId="main.settings.account.status.fail"
                onSecondaryPress={resetStatusMessage}
                onPrimaryPress={() =>
                  updateMentorData(
                    { status_message: statusMessage },
                    'status_message',
                  )
                }
              />
            ),
            () => (
              <Toast
                toastType="success"
                duration={mentorUpdate.successResetDuration}
                messageId="main.settings.account.status.success"
              />
            ),
          ),
        )}
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  fieldName: {
    ...fonts.regularBold,
    color: colors.darkestBlue,
    marginTop: 16,
  },
  dataContainer: {
    paddingVertical: 16,
    borderTopColor: colors.formBorderGray,
    borderTopWidth: 1,
  },
  button: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  failBox: {
    tintColor: colors.danger,
  },
  vacationSwitch: { marginTop: 8 },
});
