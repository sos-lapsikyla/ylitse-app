import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';

import fonts from './fonts';
import colors from './colors';
import shadow from './shadow';

import { toastProps } from './toastProps';

type ToastType = 'danger' | 'success';
type Props = {
  style?: RN.StyleProp<RN.TextStyle>;
  duration: number;
  messageId: localization.MessageId;
  toastType: ToastType;
};

export const Toast: React.FC<Props> = ({
  style,
  duration,
  messageId,
  toastType,
}) => {
  const opacity = React.useRef(new RN.Animated.Value(0)).current;

  const { backgroundColor, tintColor, icon } = toastProps[toastType];

  const showAndDisappear = () =>
    RN.Animated.sequence([
      RN.Animated.timing(opacity, {
        toValue: 1,
        duration: duration * 0.2,
        useNativeDriver: true,
        easing: RN.Easing.linear,
      }),
      RN.Animated.timing(opacity, {
        toValue: 1,
        duration: duration * 0.6,
        useNativeDriver: true,
        easing: RN.Easing.linear,
      }),
      RN.Animated.timing(opacity, {
        toValue: 0,
        duration: duration * 0.2,
        useNativeDriver: true,
        easing: RN.Easing.linear,
      }),
    ]).start();
  React.useEffect(showAndDisappear, []);

  return (
    <RN.Animated.View
      style={[styles.container, style, { opacity, backgroundColor }]}
    >
      <RN.Image style={[styles.image, { tintColor }]} source={icon} />
      <Message id={messageId} style={styles.text} />
    </RN.Animated.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    zIndex: 10,
    ...shadow(7),
  },
  text: {
    color: colors.darkestBlue,
    ...fonts.regular,
    textAlign: 'center',
  },
  image: {
    width: 40,
    height: 40,
    tintColor: colors.danger,
  },
});
