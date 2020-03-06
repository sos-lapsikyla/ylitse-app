import React from 'react';
import RN from 'react-native';

import * as redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as state from '../../../../state';
import * as actions from '../../../../state/actions';
import * as selectors from '../../../../state/selectors';

import Message from './Message';
import DateBubble from './DateBubble';

type StateProps = { messages: selectors.Message[] };
type DispatchProps = {
  pollMessages: () => void | undefined;
};
type OwnProps = { buddyId: string };

type Props = StateProps & DispatchProps & OwnProps;

const MessageList = ({ messages }: Props) => {
  return (
    <RN.FlatList
      contentContainerStyle={styles.scrollContent}
      data={messages}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      inverted={true}
    />
  );
};

function renderItem({ item }: { item: selectors.Message }) {
  if (item.type === 'Message') {
    return <Message {...item.value} />;
  } else {
    return <DateBubble {...item} />;
  }
}

const styles = RN.StyleSheet.create({
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
  ({ messages }, { buddyId }) => {
    return { messages: selectors.getMessages(messages, buddyId) };
  },
  (dispatch: redux.Dispatch<actions.Action>) => ({
    pollMessages: () => {
      dispatch(actions.creators.fetchMessages());
    },
  }),
)(MessageList);
