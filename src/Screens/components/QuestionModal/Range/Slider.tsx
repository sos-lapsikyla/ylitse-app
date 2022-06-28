import React from 'react';
import * as RN from 'react-native';

import RNCSlider from '@react-native-community/slider';

export type Props = {
  onValueChange: (value: number) => void;
  value: number;
  valueRange: [number, number];
  testID?: string;
};

const Slider: React.FC<Props> = ({
  onValueChange,
  value,
  valueRange: [min, max],
  testID,
}) => (
  <RN.View style={styles.sliderContainer}>
    <RN.Image
      style={styles.track}
      source={require('../../../images/SliderTrack.svg')}
    />
    <RNCSlider
      testID={testID}
      style={styles.slider}
      value={value}
      minimumValue={min}
      maximumValue={max}
      maximumTrackTintColor="transparent"
      minimumTrackTintColor="transparent"
      thumbImage={require('../../../images/SliderThumb.svg')}
      onSlidingComplete={onValueChange}
      tapToSeek
    />
  </RN.View>
);

const styles = RN.StyleSheet.create({
  sliderContainer: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  slider: {
    zIndex: 2,
  },
  track: {
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    resizeMode: 'stretch',
  },
});
export default Slider;
