import React from 'react';
import RN from 'react-native';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';
import shadow from '../../../components/shadow';

import * as messageApi from '../../../../api/messages';

type Props = Pick<messageApi.Message, 'content' | 'sentTime' | 'type'>;

const Message = ({ content, sentTime, type }: Props) => {
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
    backgroundColor: colors.faintGray,
    alignSelf: 'flex-end',
  },
  bubble: {
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
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
