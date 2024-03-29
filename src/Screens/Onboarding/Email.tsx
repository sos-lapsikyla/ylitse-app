import React from 'react';
import RN from 'react-native';

import { isRight } from 'fp-ts/lib/Either';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import * as accountApi from '../../api/account';
import { ValidEmail } from '../../lib/validators';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors from '../components/colors';
import Button from '../components/Button';
import NamedInputField from '../components/NamedInputField';
import InfoBox from '../components/InfoBox';

export type EmailRoute = {
  'Onboarding/Email': {
    user: Omit<accountApi.User, 'email'>;
  };
};

type Props = StackScreenProps<StackRoutes, 'Onboarding/Email'>;

const Email = ({ navigation, route }: Props) => {
  const [email, setEmail] = React.useState('');

  const goBack = () => {
    navigation.goBack();
  };

  const navigateNext = () => {
    navigation.navigate('Onboarding/PrivacyPolicy', {
      user: {
        ...route.params?.user,
        email,
      },
    });
  };

  const emailParsingResult = ValidEmail.decode(email);
  const isValidEmail = isRight(emailParsingResult);

  return (
    <OnboardingBackground testID="onboarding.email.view">
      <Card style={styles.card}>
        <RN.View>
          <Message style={styles.title} id="onboarding.email.title" />
          <NamedInputField
            autoCapitalize="none"
            style={styles.nickNameInput}
            name="onboarding.email.inputTitle"
            onChangeText={setEmail}
            autoComplete="off"
            value={email}
            testID="onboarding.email.inputTitle"
          />
          <InfoBox messageId="onboarding.email.bodyText" />
        </RN.View>
        <RN.View style={styles.buttonContainer}>
          <Button
            messageId="onboarding.signUp.back"
            onPress={goBack}
            noShadow={true}
            style={styles.backButton}
            emphasis="medium"
          />
          <Button
            style={styles.nextButton}
            badgeStyle={styles.badgeStyle}
            onPress={navigateNext}
            messageId="onboarding.email.nextButton"
            badge={require('../images/arrow-right.svg')}
            testID="onboarding.email.nextButton"
            disabled={!isValidEmail}
          />
        </RN.View>
      </Card>
    </OnboardingBackground>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 24,
    marginVertical: 20,
    alignSelf: 'stretch',
  },
  title: {
    ...fonts.titleBold,
    textAlign: 'center',
    color: colors.darkestBlue,
    marginBottom: 16,
  },
  nickNameInput: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  backButton: {
    flex: 1.2,
    marginHorizontal: 4,
    height: 32,
    marginTop: 4,
  },
  nextButton: {
    flex: 2,
    height: 32,
    width: 32,
    marginTop: 4,
    marginLeft: 18,
  },
  badgeStyle: {
    height: 32,
    width: 32,
    marginTop: 5,
    marginLeft: 4,
  },
});

export default Email;
