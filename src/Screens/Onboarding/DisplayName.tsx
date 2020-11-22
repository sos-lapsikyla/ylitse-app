import React from 'react';
import RN from 'react-native';

import * as authApi from '../../api/auth';

import * as navigationProps from '../../lib/navigation-props';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors from '../components/colors';
import Button from '../components/Button';
import NamedInputField from '../components/NamedInputField';

import { EmailRoute } from './Email';

export type DisplayNameRoute = {
  'Onboarding/DisplayName': { credentials: authApi.Credentials };
};

type Props = navigationProps.NavigationProps<DisplayNameRoute, EmailRoute>;

const DisplayName = ({ navigation }: Props) => {
  const { userName, password } = navigation.getParam('credentials');
  const [displayName, setDisplayName] = React.useState(userName);
  const goBack = () => {
    navigation.goBack();
  };
  const navigateToEmailScreen = () => {
    navigation.navigate('Onboarding/Email', {
      user: { userName, password, displayName },
    });
  };
  return (
    <OnboardingBackground testID="onboarding.displayName.view">
      <Card style={styles.card}>
        <Message style={styles.title} id="onboarding.displayName.title" />
        <NamedInputField
          autoCapitalize="none"
          style={styles.nickNameInput}
          name="onboarding.displayName.inputTitle"
          onChangeText={setDisplayName}
          autoCompleteType="off"
          value={displayName}
          testID="onboarding.displayName.inputTitle"
        />
        <Message style={styles.bodyText} id="onboarding.displayName.bodyText" />
        <Button
          style={styles.nextButton}
          onPress={navigateToEmailScreen}
          messageId="onboarding.displayName.nextButton"
          badge={require('../images/arrow.svg')}
          testID="onboarding.displayName.nextButton"
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

export default DisplayName;
