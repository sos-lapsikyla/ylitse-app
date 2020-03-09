import React from 'react';
import RN from 'react-native';
import * as ReactRedux from 'react-redux';

import * as state from '../../../../state';
import * as selectors from '../../../../state/selectors';

import Message from './Message';
import DateBubble from './DateBubble';

type StateProps = { messages: selectors.Message[] };
type OwnProps = { buddyId: string };

type Props = StateProps & OwnProps;

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

export default ReactRedux.connect<StateProps, {}, OwnProps, state.AppState>(
  ({ messages }, { buddyId }) => {
    return { messages: selectors.getMessages(messages, buddyId) };
  },
)(MessageList);
