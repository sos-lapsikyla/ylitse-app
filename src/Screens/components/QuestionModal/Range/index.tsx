import React from 'react';
import * as RN from 'react-native';

import fonts from '../../fonts';
import Button from '../../Button';

import Slider, { Props as SliderProps } from './Slider';

type Props = {
  minText: string;
  maxText: string;
};

export default ({ minText, maxText, ...sliderProps }: SliderProps & Props) => {
  return (
    <RN.View style={styles.cardContent}>
      <RN.View style={styles.textContainer}>
        <RN.Text style={styles.leftText}>{minText}</RN.Text>
        <RN.View style={styles.spacer} />
        <RN.Text style={styles.rightText}>{maxText}</RN.Text>
      </RN.View>

      <Slider {...sliderProps} />

      <Button
        style={styles.button}
        onPress={() => {}}
        messageId="components.slider.SendAnswerButton"
      />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  cardContent: {
    padding: 24,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftText: {
    flex: 1,
    ...fonts.regular,
  },
  spacer: {
    flex: 1,
  },
  rightText: {
    flex: 1,
    ...fonts.regular,
    textAlign: 'right',
  },
  button: {
    marginTop: 24,
    alignSelf: 'center',
    minWidth: '40%',
  },
});
