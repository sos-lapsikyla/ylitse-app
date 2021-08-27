import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import * as selector from '../../../../state/selectors';

import * as config from '../../../../api/config';
import * as actions from '../../../../state/actions';
import * as mentorState from '../../../../state/reducers/mentors';

import Button from '../../../components/Button';
import Message from '../../../components/Message';
import ToggleSwitch from '../../../components/ToggleSwitch';
import Spinner from '../../../components/Spinner';
import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

type Props = {
  userId: string;
};

export default ({ userId }: Props) => {
  const mentor = useSelector(mentorState.getMentorByUserId(userId));

  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const isLoading = useSelector(selector.getIsChangeVacationStatusLoading);

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
});