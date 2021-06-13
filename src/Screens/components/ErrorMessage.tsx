import React from 'react';
import RN from 'react-native';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import * as localization from '../../localization';

import { AnimatedMessage } from './Message';
import fonts from '../components/fonts';
import colors from '../components/colors';

interface Props<E> {
  data: RD.RemoteData<E, unknown>;
  getMessageId: (e: E) => localization.MessageId;
  style?: RN.StyleProp<RN.TextStyle>;
  testID?: string;
}

function ErrorMessage<E>({ style, data, getMessageId, testID }: Props<E>) {
  const opacity = React.useRef(new RN.Animated.Value(0)).current;

  const defaultConfig = {
    animation: {
      useNativeDriver: true,
      easing: RN.Easing.linear,
      toValue: 0,
      duration: 300,
    },
    messageId: localization.blank,
  };

  const { animation, messageId } = pipe(
    data,
    RD.fold(
      () => defaultConfig,
      () => defaultConfig,
      e => ({
        animation: {
          useNativeDriver: true,
          easing: RN.Easing.linear,
          toValue: 1,
          duration: 500,
        },
        messageId: getMessageId(e),
      }),
      () => defaultConfig,
    ),
  );
  React.useEffect(() => {
    RN.Animated.timing(opacity, animation).start();
  }, [RD.isFailure(data)]);

  return (
    <AnimatedMessage
      style={[styles.message, { opacity }, style]}
      id={messageId}
      testID={testID}
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
