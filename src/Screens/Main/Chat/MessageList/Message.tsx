import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch } from 'react-redux';

import { markSeen } from '../../../../state/reducers/markSeen';
import * as actions from '../../../../state/actions';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';
import shadow from '../../../components/shadow';

import * as messageApi from '../../../../api/messages';

export type MessageProps = {
  type: 'Message';
  value: messageApi.Message;
  id: string;
};

const Message = ({ value: message }: MessageProps) => {
  const { content, sentTime, type } = message;
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  React.useEffect(() => {
    if (!message.isSeen && message.type === 'Received') {
      dispatch(markSeen({ message }));
    }
  }, []);

  const bubbleStyle =
    type === 'Received' ? styles.leftBubble : styles.rightBubble;

  const addZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const date = new Date(sentTime);
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const timeText = `${hours}:${minutes}`;

  return (
    <RN.View style={[bubbleStyle, styles.bubble]}>
      <RN.View>
        <RN.Text style={styles.text}>{content}</RN.Text>
      </RN.View>

      <RN.Text style={styles.timeText}>{timeText}</RN.Text>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  leftBubble: {
    borderTopRightRadius: 24,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  rightBubble: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    backgroundColor: colors.lightestGray,
    alignSelf: 'flex-end',
  },
  bubble: {
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...shadow(5),
  },
  text: {
    ...fonts.regular,
    marginBottom: 4,
    marginRight: 8,
  },
  timeText: {
    ...fonts.tiny,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
});

export default Message;
