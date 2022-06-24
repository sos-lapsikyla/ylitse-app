import React from 'react';
import * as RN from 'react-native';

import colors from '../../colors';
import fonts from '../../fonts';

import { ValueButton } from './ValueButton';

type Props = {
  yesText: string;
  yesValue: number;
  noText: string;
  noValue: number;
  onAnswer: (answer: number) => void;
};

export default ({ yesText, yesValue, noText, noValue, onAnswer }: Props) => (
  <RN.View style={styles.buttonContainer}>
    <ValueButton
      text={noText}
      value={noValue}
      style={styles.noButton}
      onPress={onAnswer}
    />
    <ValueButton
      text={yesText}
      value={yesValue}
      style={styles.yesButton}
      onPress={onAnswer}
    />
  </RN.View>
);

const styles = RN.StyleSheet.create({
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: colors.red,
    marginRight: 12,
  },
  text: {
    ...fonts.regularBold,
    textAlign: 'center',
  },
  yesButton: {
    backgroundColor: colors.buttonGreen,
    marginLeft: 12,
  },
});
