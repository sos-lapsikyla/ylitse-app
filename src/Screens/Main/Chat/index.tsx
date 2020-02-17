import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import * as http from '../../../lib/http';
import * as remoteData from '../../../lib/remote-data';

import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';

import * as navigationProps from '../../../lib/navigation-props';

import * as messageApi from '../../../api/messages';

import Title from './Title';
import Input from './Input';
import Bubble from './Bubble';

import { gradients } from '../../components/colors';

export type ChatRoute = {
  'Main/Chat': { buddyId: string };
};

const renderItem = ({ item }: { item: messageApi.Message }) => {
  return <Bubble {...item} />;
};

type StateProps = {
  threads: remoteData.RemoteData<selectors.Thread[], http.Err>;
};
type DispatchProps = {
  pollMessages: () => void | undefined;
};

type OwnProps = navigationProps.NavigationProps<ChatRoute, ChatRoute>;

type Props = NavProps & DispatchProps & StateProps;

const Chat = ({ navigation, threads }: Props) => {
  const goBack = () => {
    navigation.goBack();
  };

  const buddyId = navigation.getParam('buddyId');


  const thread = threads[buddyId];

  const keyboardViewBehaviour =
    RN.Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <LinearGradient style={styles.screen} colors={gradients.whitegray}>
      <Title style={styles.title} onPress={goBack} name={buddyId} />
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

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.AppState
>(
  appState => {
    return {
      threads: selectors.getThreads(appState),
    };
  },
  (dispatch: redux.Dispatch<actions.Action>) => ({
    pollMessages: () => {
      dispatch(
        actions.creators.startPolling(actions.creators.fetchMessages(), 3000),
      );
    },
  }),
(Chat);
