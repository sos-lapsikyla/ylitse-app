import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import fonts from './fonts';
import colors from './colors';

type Props = {
  style?: RN.StyleProp<RN.ViewStyle>;
  linkName: localization.MessageId;
  url: string;
};

const Link = ({ style, linkName, url }: Props) => {
  const onPress = () => {
    RN.Linking.openURL(url);
  };

  return (
    <RN.TouchableOpacity style={[styles.touchable, style]} onPress={onPress}>
      <Message style={styles.linkText} id={linkName} />
      <RN.Image source={require('../images/link.svg')} style={styles.icon} />
    </RN.TouchableOpacity>
  );
};

interface MessageLinkProps extends RN.TextProps {
  id: localization.MessageId;
  link: {
    linkName: localization.MessageId;
    url: string;
    style?: RN.StyleProp<RN.ViewStyle>;
  };
}

export const MessageWithLink = ({
  id,
  link,
  ...textProps
}: MessageLinkProps) => (
  <RN.Text {...textProps}>
    {localization.trans(id)}
    <Link {...link} />
  </RN.Text>
);

const styles = RN.StyleSheet.create({
  touchable: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
  },
  linkText: {
    ...fonts.largeBold,
    color: colors.purple,
    textDecorationLine: 'underline',
  },
  icon: {
    tintColor: colors.purple,
  },
});

export default Link;
