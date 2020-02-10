import React from 'react';
import RN from 'react-native';

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
    if (remoteData.isErr(data)) {
      RN.Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: RN.Easing.linear,
      }).start();
    } else {
      RN.Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: RN.Easing.linear,
      }).start();
    }
  }, [data.type]);

  return (
    <AnimatedMessage
      style={[styles.message, { opacity }, style]}
      id={remoteData.unwrapErr(data, getMessageId, 'meta.blank')}
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
