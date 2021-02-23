import React from 'react';
import RN from 'react-native';

import * as localization from '../../../../localization';

import Message from '../../../components/Message';
import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

type Props = {
  duration: number;
  imageSource: RN.ImageSourcePropType;
  style?: RN.StyleProp<RN.ViewStyle>;
  imageStyle?: RN.StyleProp<RN.ImageStyle>;
  messageId: localization.MessageId;
};

export default (props: Props) => {
  const opacity = React.useRef(new RN.Animated.Value(0)).current;
  const fade = () =>
    RN.Animated.sequence([
      RN.Animated.timing(opacity, {
        toValue: 1,
        duration: props.duration * 0.2,
        useNativeDriver: true,
        easing: RN.Easing.linear,
      }),
      RN.Animated.timing(opacity, {
        toValue: 1,
        duration: props.duration * 0.6,
        useNativeDriver: true,
        easing: RN.Easing.linear,
      }),
      RN.Animated.timing(opacity, {
        toValue: 0,
        duration: props.duration * 0.2,
        useNativeDriver: true,
        easing: RN.Easing.linear,
      }),
    ]).start();
  React.useEffect(fade, []);
  return (
    <RN.Animated.View style={[styles.container, props.style, { opacity }]}>
      <RN.Image
        style={[styles.image, props.imageStyle]}
        source={props.imageSource}
      />
      <Message id={props.messageId} style={styles.text} />
    </RN.Animated.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    padding: 24,
  },
  text: {
    color: colors.darkestBlue,
    ...fonts.largeBold,
    textAlign: 'center',
  },
  image: {
    width: 160,
    height: 160,
    tintColor: colors.darkestBlue,
    marginBottom: 40,
  },
});
