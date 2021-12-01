import React from 'react';
import RN from 'react-native';

import { isRight } from 'fp-ts/lib/Either';

import * as authApi from '../../api/auth';

import * as navigationProps from '../../lib/navigation-props';
import { ValidName } from '../../lib/validators';

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
            autoCompleteType="off"
            value={displayName}
            testID="onboarding.displayName.inputTitle"
          />
          <Message
            style={styles.bodyText}
            id="onboarding.displayName.bodyText"
          />
        </RN.View>
        <RN.View style={styles.buttonContainer}>
          <Button
            messageId="onboarding.signUp.back"
            onPress={goBack}
            noShadow={true}
            style={styles.backButton}
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
  bodyText: {
    ...fonts.regular,
    color: colors.darkestBlue,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  nextButton: { flex: 1, width: 32, height: 32 },
  backButton: {
    backgroundColor: colors.lightestGray,
    marginHorizontal: 20,
  },
  notValidButton: { flex: 1, backgroundColor: colors.lightestGray },
  badgeStyle: {
    height: 32,
    width: 32,
    marginTop: 4,
  },
});

export default DisplayName;
