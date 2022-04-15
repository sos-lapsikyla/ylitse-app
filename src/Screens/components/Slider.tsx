import React from 'react';
import * as RN from 'react-native';

import RNCSlider from '@react-native-community/slider';

type Props = {
  onValueChange: (value: number) => void;
  value: number;
  valueRange: [number, number];
};

const Slider: React.FC<Props> = ({
  onValueChange,
  value,
  valueRange: [min, max],
}) => {
  return (
    <RN.View style={styles.sliderContainer}>
      <RN.Image
        style={styles.track}
        source={require('../images/SliderTrack.svg')}
      />
      <RNCSlider
        style={styles.slider}
        value={value}
        minimumValue={min}
        maximumValue={max}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        thumbImage={require('../images/SliderThumb.svg')}
        onSlidingComplete={onValueChange}
      />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  sliderContainer: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  slider: {
    zIndex: 2,
    alignSelf: 'stretch',
  },
  track: {
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    resizeMode: 'contain',
  },
});
export default Slider;
