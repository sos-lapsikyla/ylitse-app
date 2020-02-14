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

const longText = 'asdf asdfasdf asdf asdf asdf asdf asdfasd fasd fasdf ';
const medText = 'asdfasd fasd fasdf ';

type NavProps = navigationProps.NavigationProps<ChatRoute, ChatRoute>;

type Props = NavProps;

const Chat = ({ navigation }: Props) => {
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <LinearGradient style={styles.container} colors={gradients.whitegray}>
      <Title style={styles.title} onPress={goBack} name={'Marjaleena'} />
      <RN.ScrollView contentContainerStyle={styles.scrollContent}>
        <Bubble text={longText} time={'12:15'} align="left" />
        <Bubble text={medText} time={'14:30'} align="right" />
        <Bubble text="momo" time={'09:20'} align="right" />
        <Bubble text="momo" time={'20:20'} align="left" />
      </RN.ScrollView>
      <Input />
    </LinearGradient>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {},
  scrollContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
});

export default Chat;
