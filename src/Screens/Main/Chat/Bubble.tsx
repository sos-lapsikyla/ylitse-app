import React from 'react';
import RN from 'react-native';

import colors from '../../components/colors';
import fonts from '../../components/fonts';

type Props = {
  text: string;
  time: string;
  align: 'left' | 'right';
};

const Message = ({ text, time, align }: Props) => {
  const bubbleStyle = align === 'left' ? styles.leftBubble : styles.rightBubble;
  return (
    <RN.View style={[bubbleStyle, styles.bubble]}>
      <RN.View>
        <RN.Text style={styles.text}>{text}</RN.Text>
      </RN.View>

      <RN.Text style={styles.timeText}>{time}</RN.Text>
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
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
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
