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
      <Message style={[styles.commonText, linkTextStyle]} id={linkName} />
      <RN.Image
        source={require('../images/link.svg')}
        style={[styles.commonIcon, linkIconStyle]}
      />
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
    <Link
      {...link}
      linkTextStyle={[styles.commonText, styles.linkMessageText]}
      linkIconStyle={[styles.commonIcon, styles.textLinkIcon]}
    />
  </RN.Text>
);

const styles = RN.StyleSheet.create({
  touchable: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
  },
  commonText: {
    ...fonts.largeBold,
    color: colors.purple,
    textDecorationLine: 'underline',
  },
  linkMessageText: {
    ...fonts.smallBold,
    marginBottom: -5,
  },
  commonIcon: {
    tintColor: colors.purple,
  },
  textLinkIcon: {
    width: 20,
    height: 20,
    marginBottom: -5,
  },
});

export default Link;
