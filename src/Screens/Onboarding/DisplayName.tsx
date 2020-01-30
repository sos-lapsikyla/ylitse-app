import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as state from '../../state';

import * as navigationProps from '../../lib/navigation-props';
import * as remoteData from '../../lib/remote-data';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors from '../components/colors';
import Button from '../components/Button';
import NamedInputField from '../components/NamedInputField';
import ImmediatelyNavigateBack from '../components/ImmediatelyNavigateBack';

import { EmailRoute } from './Email';

export type DisplayNameRoute = {
  'Onboarding/DisplayName': {};
};

type StateProps = {
  credentialsSanityCheck: state.State['credentialsSanityCheck'];
};
type DispatchProps = {
  resetCredentialsCheck: () => void | undefined;
};

type OwnProps = navigationProps.NavigationProps<DisplayNameRoute, EmailRoute>;

type Props = StateProps & DispatchProps & OwnProps;

const DisplayName = ({
  navigation,
  resetCredentialsCheck,
  credentialsSanityCheck,
}: Props) => {
  const [displayName, setDisplayName] = React.useState(
    remoteData.unwrap(
      credentialsSanityCheck,
      ({ credentials: { userName } }) => userName,
      '',
    ),
  );

  const goBack = () => {
    resetCredentialsCheck();
    navigation.goBack();
  };
  if (credentialsSanityCheck.type !== 'Ok') {
    return <ImmediatelyNavigateBack goBack={goBack} />;
  }
  const navigateToEmailScreen = () => {
    navigation.navigate('Onboarding/Email', { displayName });
  };
  return (
    <OnboardingBackground>
      <Card style={styles.card}>
        <Message style={styles.title} id="onboarding.displayName.title" />
        <NamedInputField
          autoCapitalize="none"
          style={styles.nickNameInput}
          name="onboarding.displayName.inputTitle"
          onChangeText={setDisplayName}
          autoCompleteType="off"
          value={displayName}
        />
        <Message style={styles.bodyText} id="onboarding.displayName.bodyText" />
        <Button
          style={styles.nextButton}
          onPress={navigateToEmailScreen}
          messageId="onboarding.displayName.nextButton"
          badge={require('../images/arrow.svg')}
        />
        <Button
          gradient={[colors.faintGray, colors.faintGray]}
          messageId="onboarding.signUp.back"
          onPress={goBack}
          noShadow={true}
        />
      </Card>
    </OnboardingBackground>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    padding: 24,
    alignSelf: 'stretch',
  },
  title: {
    ...fonts.titleBold,
    textAlign: 'center',
    color: colors.deepBlue,
    marginBottom: 40,
  },
  nickNameInput: {
    marginBottom: 24,
  },
  bodyText: {
    ...fonts.regular,
    color: colors.deepBlue,
    marginBottom: 40,
  },
  nextButton: { marginBottom: 16 },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.State
>(
  ({ credentialsSanityCheck }) => ({ credentialsSanityCheck }),
  (dispatch: redux.Dispatch<state.Action>) => ({
    resetCredentialsCheck: () => {
      dispatch(state.actions.resetCredentialsSanityCheck());
    },
  }),
)(DisplayName);
