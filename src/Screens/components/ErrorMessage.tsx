import React from 'react';
import RN from 'react-native';

import * as remoteData from '../../lib/remote-data';
import * as localization from '../../localization';

import { AnimatedMessage } from './Message';
import fonts from '../components/fonts';
import colors from '../components/colors';

interface Props {
  data: remoteData.RemoteData<unknown>;
  messageId: localization.MessageId;
  style?: RN.StyleProp<RN.TextStyle>;
}

const ErrorMessage = ({ style, data, messageId }: Props) => {
  const opacity = React.useRef(new RN.Animated.Value(0)).current;
  React.useEffect(() => {
    if (remoteData.isFailure(data)) {
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
      id={messageId}
    />
  );
};

const styles = RN.StyleSheet.create({
  message: {
    ...fonts.regularBold,
    textAlign: 'center',
    color: colors.danger,
    opacity: 0,
  },
});

export default ErrorMessage;
