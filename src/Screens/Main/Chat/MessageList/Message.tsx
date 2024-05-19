import React from 'react';
import RN from 'react-native';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';
import shadow from '../../../components/shadow';

import * as messageApi from '../../../../api/messages';

export type MessageProps = {
  type: 'Message';
  value: messageApi.Message;
  id: string;
  isSeen: boolean;
};

const Message = ({ value: message }: MessageProps) => {
  const { content, sentTime, type } = message;

  const bubbleStyle =
    type === 'Received' ? styles.leftBubble : styles.rightBubble;

  // TODO: Visual aid, remove this after review
  const isSeenBorder = type === 'Received' &&
    !message.isSeen && { borderWidth: 2, borderColor: colors.orangeLight };

  const addZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const date = new Date(sentTime);
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const timeText = `${hours}:${minutes}`;

  return (
    <RN.View style={[bubbleStyle, isSeenBorder, styles.bubble]}>
      <RN.View>
        <RN.Text style={styles.text}>{content}</RN.Text>
      </RN.View>

      <RN.Text style={styles.timeText}>{timeText}</RN.Text>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  leftBubble: {
    borderRadius: 24,
    borderTopLeftRadius: 0,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  rightBubble: {
    borderRadius: 24,
    borderTopRightRadius: 0,
    backgroundColor: colors.whiteBlue,
    alignSelf: 'flex-end',
  },
  bubble: {
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    maxWidth: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...shadow(4),
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
