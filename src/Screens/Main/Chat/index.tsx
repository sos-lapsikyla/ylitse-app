import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as navigationProps from '../../../lib/navigation-props';

import Title from './Title';
import Input from './Input';
import Bubble from './Bubble';

import { gradients } from '../../components/colors';

export type ChatRoute = {
  'Main/Chat': {};
};

const messages = [
  { key: '1', text: 'eka viesti', time: '12.15', align: 'left' },
  { key: '2', text: 'jooj juuuh joo', time: '12.15', align: 'right' },
  { key: '3', text: 'jooj juuuh joo', time: '12.15', align: 'left' },
  { key: '4', text: 'jooj juuuh joo', time: '12.15', align: 'left' },
  { key: '5', text: 'jooj juuuh joo', time: '12.15', align: 'right' },
  { key: '6', text: 'eka viesti', time: '12.15', align: 'left' },
  { key: '7', text: 'jooj juuuh joo', time: '12.15', align: 'right' },
  { key: '8', text: 'jooj juuuh joo', time: '12.15', align: 'left' },
  { key: '9', text: 'jooj juuuh joo', time: '12.15', align: 'left' },
  { key: '10', text: 'jooj juuuh joo', time: '12.15', align: 'right' },
  { key: '11', text: 'vika viesti', time: '12.15', align: 'left' },
  { key: '12', text: 'eka viesti', time: '12.15', align: 'left' },
  { key: '13', text: 'jooj juuuh joo', time: '12.15', align: 'right' },
  { key: '14', text: 'jooj juuuh joo', time: '12.15', align: 'left' },
  { key: '15', text: 'jooj juuuh joo', time: '13.15', align: 'left' },
];

type Message = {
  text: string;
  time: string;
  align: 'left' | 'right';
};

const renderItem = ({ item }: { item: Message }) => {
  return <Bubble {...item} />;
};

type NavProps = navigationProps.NavigationProps<ChatRoute, ChatRoute>;

type Props = NavProps;

const Chat = ({ navigation }: Props) => {
  const goBack = () => {
    navigation.goBack();
  };

  const keyboardViewBehaviour =
    RN.Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <LinearGradient style={styles.screen} colors={gradients.whitegray}>
      <Title style={styles.title} onPress={goBack} name={'Marjaleena'} />
      <RN.KeyboardAvoidingView
        style={styles.container}
        behavior={keyboardViewBehaviour}
      >
        <RN.FlatList
          contentContainerStyle={styles.scrollContent}
          data={messages}
          renderItem={renderItem}
          inverted={true}
        />
        <Input />
      </RN.KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = RN.StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  title: {},
  scrollContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
});

export default Chat;
