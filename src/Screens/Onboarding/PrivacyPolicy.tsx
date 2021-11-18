import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as O from 'fp-ts/lib/Option';
import * as RD from '@devexperts/remote-data-ts';

import * as navigationProps from '../../lib/navigation-props';

import * as config from '../../api/config';
import * as accountApi from '../../api/account';
import * as state from '../../state';
import * as actions from '../../state/actions';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import MessageSwitch from '../components/MessageSwitch';
import colors from '../components/colors';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Link from '../components/Link';

import navigateMain from './navigateMain';
import { TabsRoute } from '../Main/Tabs';

export type PrivacyPolicyRoute = {
  'Onboarding/PrivacyPolicy': { user: accountApi.User };
};

type StateProps = {
  accessToken: state.AppState['accessToken'];
  createUserState: state.AppState['createUser'];
};

type DispatchProps = {
  createUser: (user: accountApi.User) => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<PrivacyPolicyRoute, TabsRoute>;

type Props = StateProps & DispatchProps & OwnProps;

const PrivacyPolicy = ({
  navigation,
  accessToken,
  createUser,
  createUserState,
}: Props) => {
  React.useEffect(() => {
    if (O.isSome(accessToken.currentToken)) {
      navigateMain(navigation);
    }
  }, [accessToken]);
  const [isAgreed, setAgreed] = React.useState(false);
  const [isOver15, setIsOver15] = React.useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  const onNextPress = () => {
    const user = navigation.getParam('user');
    createUser(user);
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
          style={styles.link}
          linkName="onboarding.privacyPolicy.link"
          url={config.termsUrl}
        />

        <ErrorMessage
          style={styles.errorText}
          getMessageId={() => 'meta.error'}
          data={createUserState}
        />

        <MessageSwitch
          style={styles.switch}
          containerStyle={styles.toggleMargin}
          onPress={() => setIsOver15(!isOver15)}
          value={isOver15}
          testID={'onboarding.age.switch'}
          messageOn={'onboarding.age.switch'}
          messageOff={'onboarding.age.switch'}
        />
        <MessageSwitch
          style={styles.switch}
          containerStyle={styles.toggleMargin}
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
          />

          <Button
            style={
              isAgreed && isOver15 ? styles.nextButton : styles.notValidButton
            }
            badgeStyle={styles.arrow}
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
  arrow: {
    marginTop: 4,
    width: 32,
    height: 32,
  },
  card: {
    padding: 32,
    alignSelf: 'stretch',
  },
  title: {
    ...fonts.titleBold,
    textAlign: 'center',
    color: colors.darkestBlue,
    marginBottom: 32,
  },
  nickNameInput: {
    marginBottom: 24,
  },
  bodyText: {
    ...fonts.regular,
    color: colors.darkestBlue,
    marginBottom: 32,
  },
  bodyText3: {
    ...fonts.regular,
    color: colors.darkestBlue,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  backButton: {
    backgroundColor: colors.lightestGray,
  },
  notValidButton: {
    backgroundColor: colors.lightestGray,
    flex: 1,
    marginHorizontal: 20,
    width: 32,
    height: 32,
  },
  nextButton: {
    flex: 1,
    marginHorizontal: 20,
    width: 32,
    height: 32,
  },
  toggleMargin: {
    marginBottom: 16,
  },
  link: {},
  errorText: {},
  switch: {},
});

export default ReactRedux.connect<StateProps, {}, OwnProps, state.AppState>(
  ({ accessToken, createUser }) => ({
    accessToken,
    createUserState: createUser,
  }),
  (dispatch: redux.Dispatch<actions.Action>) => ({
    createUser: (payload: accountApi.User) => {
      dispatch({ type: 'createUser/start', payload });
    },
  }),
)(PrivacyPolicy);
