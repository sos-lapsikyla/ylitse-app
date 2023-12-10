import React from 'react';
import RN from 'react-native';

import { isRight } from 'fp-ts/lib/Either';
import * as authApi from '../../api/auth';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import { ValidName } from '../../lib/validators';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors from '../components/colors';
import Button from '../components/Button';
import NamedInputField from '../components/NamedInputField';
import InfoBox from '../components/InfoBox';

export type DisplayNameRoute = {
  'Onboarding/DisplayName': { credentials: authApi.Credentials };
};

type Props = StackScreenProps<StackRoutes, 'Onboarding/DisplayName'>;

const DisplayName = ({ navigation, route }: Props) => {
  const { userName, password } = route.params?.credentials;
  const [displayName, setDisplayName] = React.useState(userName);

  const goBack = () => {
    navigation.goBack();
  };

  const navigateToEmailScreen = () => {
    navigation.navigate('Onboarding/Email', {
      user: { userName, password, displayName },
    });
  };
  const nameParsingResult = ValidName.decode(displayName);
  const isValidDisplayName = isRight(nameParsingResult);

  return (
    <OnboardingBackground testID="onboarding.displayName.view">
      <Card style={styles.card}>
        <RN.View>
          <Message style={styles.title} id="onboarding.displayName.title" />
          <NamedInputField
            autoCapitalize="none"
            style={styles.nickNameInput}
            name="onboarding.displayName.inputTitle"
            onChangeText={setDisplayName}
            autoComplete="off"
            value={displayName}
            testID="onboarding.displayName.inputTitle"
          />
          <InfoBox messageId="onboarding.displayName.bodyText" />
        </RN.View>
        <RN.View style={styles.buttonContainer}>
          <Button
            messageId="onboarding.signUp.back"
            onPress={goBack}
            noShadow={true}
            style={styles.backButton}
            emphasis="low"
          />

          <Button
            style={
              isValidDisplayName ? styles.nextButton : styles.notValidButton
            }
            badgeStyle={styles.badgeStyle}
            onPress={navigateToEmailScreen}
            messageId="onboarding.displayName.nextButton"
            badge={require('../images/arrow-right.svg')}
            testID="onboarding.displayName.nextButton"
            disabled={!isValidDisplayName}
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
    marginVertical: 24,
    padding: 24,
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
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1.2,
    marginHorizontal: 4,
    height: 32,
    marginTop: 4,
  },
  notValidButton: {
    flex: 2,
    height: 32,
    width: 32,
    marginTop: 4,
    marginLeft: 18,
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

export default DisplayName;
