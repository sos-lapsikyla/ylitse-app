import React from 'react';
import * as RN from 'react-native';

import colors from '../../colors';
import fonts from '../../fonts';

import { Button } from './Button';

type Props = {
  yesText: string;
  yesValue: number;
  noText: string;
  noValue: number;
};

export default ({ yesText, yesValue, noText, noValue }: Props) => {
  return (
    <RN.View style={styles.buttonContainer}>
      <Button text={noText} value={noValue} style={styles.noButton} />
      <Button text={yesText} value={yesValue} style={styles.yesButton} />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: colors.red,
  },
  text: {
    ...fonts.regularBold,
    textAlign: 'center',
  },
  yesButton: {
    backgroundColor: colors.green,
  },
});
