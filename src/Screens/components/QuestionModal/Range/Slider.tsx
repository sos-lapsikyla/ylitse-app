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
}) => {
  return (
    // XXX(Pyry): This outmoust <View> wrapping Protects track image from
    // margins and padding. Without this and with padding track will be too
    // slim. There sure is a better way?
    <RN.View>
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
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbImage={require('../../../images/SliderThumb.svg')}
          onSlidingComplete={onValueChange}
        />
      </RN.View>
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
