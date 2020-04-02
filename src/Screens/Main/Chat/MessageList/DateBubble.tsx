import React from 'react';
import RN from 'react-native';

import shadow from '../../../components/shadow';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

export type DateBubbleProps = { type: 'Date'; value: string; id: string };

const DateBubble = ({ value }: DateBubbleProps) => {
  return (
    <RN.View style={styles.bubble}>
      <RN.Text>{value}</RN.Text>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  bubble: {
    borderRadius: 8,
    backgroundColor: colors.faintGray,
    alignSelf: 'center',
    marginVertical: 16,
    padding: 8,
    paddingHorizontal: 16,
    ...shadow(6),
  },
  text: {
    ...fonts.regular,
    marginBottom: 4,
    marginRight: 8,
  },
});

export default DateBubble;
