import React from 'react';
import RN from 'react-native';

import * as taggedUnion from '../../lib/tagged-union';
import * as remoteData from '../../lib/remote-data';
import * as localization from '../../localization';

import { AnimatedMessage } from './Message';
import fonts from '../components/fonts';
import colors from '../components/colors';

interface Props<E> {
  data: remoteData.RemoteData<unknown, E>;
  getMessageId: (e: E) => localization.MessageId;
  style?: RN.StyleProp<RN.TextStyle>;
}

function ErrorMessage<E>({ style, data, getMessageId }: Props<E>) {
  const opacity = React.useRef(new RN.Animated.Value(0)).current;
  React.useEffect(() => {
    const commonAnimationOptions = {
      useNativeDriver: true,
      easing: RN.Easing.linear,
    };
    const animation = taggedUnion.match(data, {
      Err: () => ({
        ...commonAnimationOptions,
        toValue: 1,
        duration: 500,
      }),
      default: () => ({
        ...commonAnimationOptions,
        toValue: 0,
        duration: 300,
      }),
    });
    RN.Animated.timing(opacity, animation).start();
  }, [data.type]);

  const messageId = taggedUnion.match(data, {
    Err: ({ error }) => getMessageId(error),
    default: () => localization.blank,
  });

  return (
    <AnimatedMessage
      style={[styles.message, { opacity }, style]}
      id={messageId}
    />
  );
}

const styles = RN.StyleSheet.create({
  message: {
    ...fonts.regularBold,
    textAlign: 'center',
    color: colors.danger,
    opacity: 0,
  },
});

export default ErrorMessage;
