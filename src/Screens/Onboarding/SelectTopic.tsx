import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch } from 'react-redux';
import * as O from 'fp-ts/lib/Option';

import * as navigationProps from '../../lib/navigation-props';

import * as topicApi from '../../api/topic-storage';
import { storeTopic } from '../../state/reducers/topic';
import * as actions from '../../state/actions';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors from '../components/colors';
import shadow from '../components/shadow';

import MessageButton from '../components/MessageButton';
import TextButton from '../components/TextButton';

import { TabsRoute } from '../Main/Tabs';
import navigateMain from './navigateMain';

const topics: topicApi.Topic[] = [
  'Lastensuojelu',
  'Lasinen lapsuus',
  'Vanhemmat lastensuojelussa',
];

export type SelectTopicRoute = {
  'Onboarding/SelectTopic': {};
};

type Props = navigationProps.NavigationProps<SelectTopicRoute, TabsRoute>;

export default ({ navigation }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const select = (topic: O.Option<topicApi.Topic>) => () => {
    dispatch(storeTopic(topic));
    navigateMain(navigation);
  };

  return (
    <OnboardingBackground>
      <Card style={styles.card}>
        <Message style={styles.title} id="onboarding.selectTopic.title" />
        <Message style={styles.subtitle} id="onboarding.selectTopic.subtitle" />
        {topics.map(topic => (
          <TextButton
            key={topic}
            text={topic}
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={select(O.some(topic))}
          />
        ))}
        <MessageButton
          style={styles.skipButton}
          messageStyle={styles.buttonText}
          messageId="onboarding.selectTopic.skip"
          onPress={select(O.none)}
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
  },
  subtitle: {
    ...fonts.small,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonText: { ...fonts.titleBold, textAlign: 'center', color: colors.black },
  button: {
    minHeight: 64,
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: colors.blue60,
    justifyContent: 'center',
    ...shadow(7),
  },
  skipButton: {
    minHeight: 64,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.faintGray,
    justifyContent: 'center',
  },
});
