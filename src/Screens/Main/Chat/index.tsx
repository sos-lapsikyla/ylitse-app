import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as navigationProps from '../../../lib/navigation-props';

import Title from './Title';
import Input from './Input';
import MessageList from './MessageList';

import { gradients } from '../../components/colors';

export type ChatRoute = {
  'Main/Chat': { buddyId: string };
};

type Props = navigationProps.NavigationProps<ChatRoute, ChatRoute>;
const Chat = ({ navigation }: Props) => {
  const goBack = () => {
    navigation.goBack();
  };
  const buddyId = navigation.getParam('buddyId');
  const keyboardViewBehaviour =
    RN.Platform.OS === 'ios' ? 'padding' : undefined;
  return (
    <LinearGradient style={styles.screen} colors={gradients.whitegray}>
      <Title style={styles.title} onPress={goBack} buddyId={buddyId} />
      <RN.KeyboardAvoidingView
        style={styles.container}
        behavior={keyboardViewBehaviour}
      >
        <MessageList buddyId={buddyId} />
        <Input style={styles.input} buddyId={buddyId} />
      </RN.KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = RN.StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 8,
  },
  container: {
    flex: 1,
  },
  title: {},
  input: {
    marginTop: 8,
  },
});

export default Chat;
