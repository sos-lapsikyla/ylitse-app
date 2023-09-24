import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';

import fonts from './fonts';
import colors from './colors';
import shadow from './shadow';

import { props as toastProps } from './Modal/modalProps';

export type AlertVariant = 'danger' | 'success' | 'info' | 'warning';
type Props = {
  style?: RN.StyleProp<RN.TextStyle>;
  containerStyle?: RN.StyleProp<RN.ViewStyle>;
  duration: number;
  messageId: localization.MessageId;
  toastType: AlertVariant;
};

export const Toast: React.FC<Props> = ({
  style,
  containerStyle,
  duration,
  messageId,
  toastType,
}) => {
  const opacity = React.useRef(new RN.Animated.Value(0)).current;

  const { backgroundColor, tintColor, icon } = toastProps[toastType];

  const fadeInAndOut = () =>
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
  React.useEffect(fadeInAndOut, []);

  return (
    <RN.View style={containerStyle ?? styles.container}>
      <RN.Modal animationType="fade" transparent={true} visible={true}>
        <RN.Animated.View
          style={[styles.toastContainer, style, { opacity, backgroundColor }]}
        >
          <RN.Image style={[styles.image, { tintColor }]} source={icon} />
          <Message id={messageId} style={styles.text} />
        </RN.Animated.View>
      </RN.Modal>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  toastContainer: {
    marginHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 16,
    padding: 24,
    marginTop: 40,
    ...shadow(7),
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 24,
  },
  text: {
    color: colors.darkestBlue,
    ...fonts.regular,
    flex: 1,
    flexWrap: 'wrap',
  },
});
