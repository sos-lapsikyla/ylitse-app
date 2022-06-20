import React from 'react';
import * as RN from 'react-native';

import fonts from '../../fonts';
import Button from '../../Button';

import Slider from './Slider';

type Props = {
  minText: string;
  maxText: string;
  defaultValue: number;
  valueRange: [number, number];
  onAnswer: (answer: number) => void;
};

export default ({
  minText,
  maxText,
  defaultValue,
  onAnswer,
  ...sliderProps
}: Props) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <>
      <RN.View style={styles.textContainer}>
        <RN.Text style={styles.leftText}>{minText}</RN.Text>
        <RN.View style={styles.spacer} />
        <RN.Text style={styles.rightText}>{maxText}</RN.Text>
      </RN.View>

      <Slider
        onValueChange={setValue}
        value={value}
        {...sliderProps}
        testID={'questionModal.slider'}
      />

      <Button
        style={styles.button}
        onPress={() => onAnswer(Math.round(value))}
        messageId="components.slider.SendAnswerButton"
      />
    </>
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
