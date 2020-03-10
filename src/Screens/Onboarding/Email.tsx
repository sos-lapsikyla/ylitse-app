import React from 'react';
import RN from 'react-native';

import * as accountApi from '../../api/account';
import * as navigationProps from '../../lib/navigation-props';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors from '../components/colors';
import Button from '../components/Button';
import NamedInputField from '../components/NamedInputField';

import { PrivacyPolicyRoute } from './PrivacyPolicy';

export type EmailRoute = {
  'Onboarding/Email': {
    user: Omit<accountApi.User, 'email'>;
  };
};

type Props = navigationProps.NavigationProps<EmailRoute, PrivacyPolicyRoute>;

const Email = ({ navigation }: Props) => {
  const [email, setEmail] = React.useState('');

  const goBack = () => {
    navigation.goBack();
  };
  const navigateNext = () => {
    navigation.navigate('Onboarding/PrivacyPolicy', {
      user: {
        ...navigation.getParam('user'),
        email,
      },
    });
  };
  return (
    <OnboardingBackground>
      <Card style={styles.card}>
        <Message style={styles.title} id="onboarding.email.title" />
        <NamedInputField
          autoCapitalize="none"
          style={styles.nickNameInput}
          name="onboarding.email.inputTitle"
          onChangeText={setEmail}
          autoCompleteType="off"
          value={email}
        />
        <Message style={styles.bodyText} id="onboarding.email.bodyText" />
        <Button
          style={styles.nextButton}
          onPress={navigateNext}
          messageId="onboarding.email.nextButton"
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

export default Email;
