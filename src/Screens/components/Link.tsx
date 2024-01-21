import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import fonts from './fonts';
import colors from './colors';

type Props = {
  style?: RN.StyleProp<RN.ViewStyle>;
  linkTextStyle?: RN.StyleProp<RN.TextStyle>;
  linkIconStyle?: RN.StyleProp<RN.ImageStyle>;
  linkName: localization.MessageId;
  url: string;
};

const Link = ({
  style,
  linkTextStyle,
  linkName,
  linkIconStyle,
  url,
}: Props) => {
  const onPress = () => {
    RN.Linking.openURL(url);
  };

  return (
    <RN.TouchableOpacity style={[styles.touchable, style]} onPress={onPress}>
      <Message style={[styles.text, linkTextStyle]} id={linkName} />
      <RN.Image
        source={require('../images/link.svg')}
        style={[styles.icon, linkIconStyle]}
      />
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  touchable: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
  },
  text: {
    ...fonts.largeBold,
    color: colors.purple,
    textDecorationLine: 'underline',
  },
  icon: {
    tintColor: colors.purple,
  },
});

export default Link;
