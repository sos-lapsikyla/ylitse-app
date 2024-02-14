import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '../../../../Screens';

import { pipe } from 'fp-ts/lib/function';
import * as RD from '@devexperts/remote-data-ts';

import * as actions from '../../../../state/actions';
import * as state from '../../../../state/reducers/changePassword';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

import Message from '../../../components/Message';
import ScreenTitle from '../../../components/ScreenTitle';
import CreatedBySosBanner from '../../../components/CreatedBySosBanner';
import Spinner from '../../../components/Spinner';
import { Toast } from '../../../components/Toast';
import AlertModal from '../../../components/Modal';
import PasswordForm from './PasswordForm';

export type PasswordChangeRoute = {
  'Main/Settings/PasswordChange': {};
};

type Props = StackScreenProps<StackRoutes, 'Main/Settings/PasswordChange'>;

export default ({ navigation }: Props) => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [repeatedNewPassword, setRepeatedNewPassword] = React.useState('');
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const changePassword = () => {
    dispatch(state.changePassword({ currentPassword, newPassword }));
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  const resetAndGoBack = () => {
    dispatch(state.reset);
    onGoBack();
  };

  const reset = () => {
    dispatch(state.reset);
  };

  const requestState = useSelector(state.select);

  React.useEffect(() => {
    if (RD.isSuccess(requestState)) {
      const timeout = setTimeout(resetAndGoBack, state.coolDownDuration);

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
        <SafeAreaView style={styles.viewContainer}>
          <Message
            style={styles.title}
            id="main.settings.account.password.title"
          />
          {pipe(
            requestState,
            RD.fold(
              () => (
                <PasswordForm
                  currentPassword={currentPassword}
                  setCurrentPassword={setCurrentPassword}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  repeatedNewPassword={repeatedNewPassword}
                  setRepeatedNewPassword={setRepeatedNewPassword}
                  onGoBack={onGoBack}
                  onButtonPress={changePassword}
                />
              ),
              () => <Spinner style={styles.spinner} />,
              () => (
                <AlertModal
                  title="meta.error"
                  modalType="danger"
                  messageId="main.settings.account.password.failure"
                  onSecondaryPress={reset}
                  onPrimaryPress={changePassword}
                />
              ),
              () => (
                <Toast
                  toastType="success"
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
  },
  scrollView: {
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  spinner: {
    alignSelf: 'center',
  },
  viewContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
});
