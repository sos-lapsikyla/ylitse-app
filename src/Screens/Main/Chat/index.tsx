import React from 'react';
import RN from 'react-native';

import * as navigationProps from '../../../lib/navigation-props';

import Title from './Title';
import Input from './Input';
import MessageList from './MessageList';

import colors from '../../components/colors';

export type ChatRoute = {
  'Main/Chat': { buddyId: string; };
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
    <RN.View style={styles.screen}>
      <Title
        style={styles.title}
        onPress={goBack}
        buddyId={buddyId}
      />
      <RN.KeyboardAvoidingView
        style={styles.container}
        behavior={keyboardViewBehaviour}
      >
        <MessageList buddyId={buddyId} />
        <Input style={styles.input} buddyId={buddyId} />
      </RN.KeyboardAvoidingView>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 8,
    backgroundColor: colors.lightestGray,
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
