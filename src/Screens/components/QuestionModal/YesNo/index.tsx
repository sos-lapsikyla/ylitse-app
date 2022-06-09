import React from 'react';
import * as RN from 'react-native';

import fonts from '../../fonts';

type Props = {
  yesText: string;
  noText: string;
};

export default ({ yesText, noText }: Props) => {
  return (
    <RN.View style={styles.textContainer}>
      <RN.Text style={styles.leftText}>{yesText}</RN.Text>
      <RN.Text style={styles.rightText}>{noText}</RN.Text>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftText: {
    flex: 1,
    ...fonts.regular,
  },
  rightText: {
    flex: 1,
    ...fonts.regular,
    textAlign: 'right',
  },
});
