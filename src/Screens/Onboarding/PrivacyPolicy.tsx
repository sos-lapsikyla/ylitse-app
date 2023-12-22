import React from 'react';
import RN from 'react-native';
import * as ReactRedux from 'react-redux';
import { getAccessToken, getCreateUserState } from 'src/state/selectors';
import * as O from 'fp-ts/lib/Option';
import * as RD from '@devexperts/remote-data-ts';

import * as config from '../../api/config';
import * as accountApi from '../../api/account';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import MessageSwitch from '../components/MessageSwitch';
import colors from '../components/colors';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Link from '../components/Link';

export type PrivacyPolicyRoute = {
  'Onboarding/PrivacyPolicy': { user: accountApi.User };
};

type OwnProps = StackScreenProps<StackRoutes, 'Onboarding/PrivacyPolicy'>;

type Props = OwnProps;

const PrivacyPolicy = ({ navigation, route }: Props) => {
  const accessToken = ReactRedux.useSelector(getAccessToken);
  const createUserState = ReactRedux.useSelector(getCreateUserState);
  const dispatch = ReactRedux.useDispatch();

  React.useEffect(() => {
    if (O.isSome(accessToken)) {
      navigation.navigate('Main/Tabs', {});
    }
  }, [accessToken]);

  const [isAgreed, setAgreed] = React.useState(false);
  const [isOver15, setIsOver15] = React.useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  const onNextPress = () => {
    const user = route.params?.user ?? '';
    dispatch({ type: 'createUser/start', payload: user });
  };

  return (
    <OnboardingBackground testID="onboarding.privacyPolicy.view">
      <Card style={styles.card}>
        <Message style={styles.title} id="onboarding.privacyPolicy.title" />
        <Message
          style={styles.bodyText}
          id="onboarding.privacyPolicy.bodyText1"
        />
        <Message
          style={styles.bodyText}
          id="onboarding.privacyPolicy.bodyText2"
        />
        <Message
          style={styles.bodyText3}
          id="onboarding.privacyPolicy.bodyText3"
        />
        <Link
          linkName="onboarding.privacyPolicy.link"
          url={config.termsUrl}
          style={styles.link}
        />
        {RD.isFailure(createUserState) && (
          <ErrorMessage
            getMessageId={() => 'meta.error'}
            data={createUserState}
          />
        )}
        <MessageSwitch
          messageStyle={styles.switchMessage}
          onPress={() => setIsOver15(!isOver15)}
          value={isOver15}
          testID={'onboarding.age.switch'}
          messageOn={'onboarding.age.switch'}
          messageOff={'onboarding.age.switch'}
        />
        <MessageSwitch
          messageStyle={styles.switchMessage}
          onPress={() => setAgreed(!isAgreed)}
          value={isAgreed}
          testID={'onboarding.privacyPolicy.switch'}
          messageOn={'onboarding.privacyPolicy.switch'}
          messageOff={'onboarding.privacyPolicy.switch'}
        />
        <RN.View style={styles.buttonContainer}>
          <Button
            style={styles.backButton}
            messageId="meta.back"
            onPress={goBack}
            noShadow={true}
            emphasis="low"
          />
          <Button
            style={
              isAgreed && isOver15 ? styles.nextButton : styles.notValidButton
            }
            badgeStyle={styles.badgeStyle}
            onPress={onNextPress}
            messageId="onboarding.privacyPolicy.nextButton"
            badge={require('../images/arrow-right.svg')}
            disabled={!isAgreed || !isOver15}
            loading={RD.isPending(createUserState)}
            testID="onboarding.privacyPolicy.nextButton"
          />
        </RN.View>
      </Card>
    </OnboardingBackground>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    padding: 30,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  title: {
    ...fonts.titleBold,
    textAlign: 'center',
    color: colors.darkestBlue,
  },
  bodyText: {
    ...fonts.regular,
    color: colors.darkestBlue,
  },
  bodyText3: {
    ...fonts.regular,
    color: colors.darkestBlue,
  },
  link: {
    marginTop: -16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  backButton: {
    flex: 1.2,
    height: 32,
  },
  notValidButton: {
    backgroundColor: colors.background,
    flex: 2,
    height: 32,
    width: 32,
  },
  nextButton: {
    flex: 2,
    height: 32,
    width: 32,
  },
  badgeStyle: {
    height: 32,
    width: 32,
  },
  switchMessage: {
    ...fonts.regular,
  },
});

export default PrivacyPolicy;
