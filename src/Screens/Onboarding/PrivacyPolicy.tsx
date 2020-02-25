import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as option from 'fp-ts/lib/Option';

import * as navigationProps from '../../lib/navigation-props';
import useRemoteData from '../../lib/use-remote-data';

import * as config from '../../api/config';
import * as accountApi from '../../api/account';
import * as authApi from '../../api/auth';
import * as state from '../../state';
import * as actions from '../../state/actions';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors, { gradients } from '../components/colors';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Link from '../components/Link';

import { TabsRoute } from '../Main/Tabs';
import navigateMain from './navigateMain';

export type PrivacyPolicyRoute = {
  'Onboarding/PrivacyPolicy': { user: accountApi.NewUser };
};

type StateProps = {
  accessToken: state.AppState['accessToken'];
};

type DispatchProps = {
  login: (user: authApi.AccessToken) => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<PrivacyPolicyRoute, TabsRoute>;

type Props = StateProps & DispatchProps & OwnProps;

const PrivacyPolicy = ({ navigation, accessToken, login }: Props) => {
  const [createUserRequest, createUser] = useRemoteData(accountApi.createUser);
  React.useEffect(() => {
    if (createUserRequest.type === 'Ok') {
      login(createUserRequest.value);
    }
  }, [createUserRequest.type]);
  React.useEffect(() => {
    if (option.isSome(accessToken)) {
      navigateMain(navigation);
    }
  }, [accessToken]);

  const [isAgreed, setAgreed] = React.useState(false);
  const goBack = () => {
    navigation.goBack();
  };
  const onNextPress = () => {
    const user = navigation.getParam('user');
    createUser(user);
  };
  return (
    <OnboardingBackground>
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
          data={createUserRequest}
        />
        <Button
          onPress={() => setAgreed(true)}
          gradient={gradients.pillBlue}
          style={styles.nextButton}
          messageId="onboarding.privacyPolicy.agreeButton"
          disabled={isAgreed}
        />
        <Button
          style={styles.nextButton}
          onPress={onNextPress}
          messageId="onboarding.privacyPolicy.nextButton"
          badge={require('../images/arrow.svg')}
          disabled={!isAgreed}
          loading={createUserRequest.type === 'Loading'}
        />
        <Button
          gradient={[colors.faintGray, colors.faintGray]}
          messageId="meta.back"
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
  bodyText3: {
    ...fonts.regular,
    color: colors.deepBlue,
    marginBottom: 40,
  },
  link: { alignSelf: 'center' },
  errorText: {
    marginBottom: 16,
  },
  nextButton: { marginBottom: 16 },
});

export default ReactRedux.connect<StateProps, {}, OwnProps, state.AppState>(
  ({ accessToken }) => ({
    accessToken,
  }),
  (dispatch: redux.Dispatch<actions.Action>) => ({
    login: (token: authApi.AccessToken) => {
      dispatch(actions.creators.login(token));
    },
  }),
)(PrivacyPolicy);
