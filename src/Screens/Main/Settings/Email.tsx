import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { pipe } from 'fp-ts/lib/pipeable';
import * as RD from '@devexperts/remote-data-ts';

import * as navigationProps from '../../../lib/navigation-props';

import * as changeEmailState from '../../../state/reducers/changeEmail';
import * as actions from '../../../state/actions';
import * as selector from '../../../state/selectors'

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

export type EmailChangeRoute = {
  'Main/Settings/EmailChange': {};
};

type Props = navigationProps.NavigationProps<EmailChangeRoute, MentorListRoute>;

export default ({ navigation }: Props) => {
  const account = useSelector(selector.getAccount)

  const [email, setEmail] = React.useState(account?.email ?? '');
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const onGoBack = () => {
    navigation.goBack();
  };
  const onButtonPress = () => {
    dispatch(
      changeEmailState.changeEmail({ email, account: account }),
    );
  };
  const requestState = useSelector(changeEmailState.select);

  React.useEffect(() => {
    if (RD.isSuccess(requestState)) {
      setEmail(requestState.value.email ?? '');
      const timeout = setTimeout(onGoBack, changeEmailState.coolDownDuration);
      return () => clearTimeout(timeout);
    }
  }, [requestState]);

  return (
    <RN.View style={styles.screen}>
      <ScreenTitle id="main.settings.account.email.title" onBack={onGoBack} />
      <RN.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID={'main.settings.email.view'}
      >
        <SafeAreaView
          forceInset={{ bottom: 'always' }}
          style={styles.buttonContainer}
        >
          <Message
            style={styles.title}
            id="main.settings.account.email.title"
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
                    name="main.settings.account.email.title"
                    value={email}
                    onChangeText={setEmail}
                    testID="main.settings.account.email.input"
                  />
                  <RN.View style={styles.buttonContainer}>
                    <Button
                      style={styles.cancelButton}
                      messageStyle={styles.cancelButtonText}
                      onPress={onGoBack}
                      messageId="meta.cancel"
                      testID="main.settings.account.email.cancel"
                    />
                    <Button
                      style={styles.changePasswordButton}
                      messageStyle={styles.buttonText}
                      onPress={onButtonPress}
                      messageId="meta.save"
                      testID="main.settings.account.email.save"
                    />
                  </RN.View>
                </>
              ),
              () => <Spinner style={styles.spinner} />,
              () => (
                <AlertBox
                  imageStyle={styles.failBox}
                  imageSource={require('../../images/alert-circle.svg')}
                  duration={changeEmailState.coolDownDuration}
                  messageId="main.settings.account.email.fail"
                />
              ),
              () => (
                <AlertBox
                  imageStyle={styles.successBox}
                  imageSource={require('../../images/checkmark-circle-outline.svg')}
                  duration={changeEmailState.coolDownDuration}
                  messageId="main.settings.account.email.success"
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
    marginBottom: 24,
  },
  field: {
    marginVertical: 8,
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
    justifyContent: 'space-between',
  },
  textContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
