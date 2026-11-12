import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

interface Props extends RN.TextProps {
  id: localization.MessageId;
}

const Message = ({ id, ...textProps }: Props) => (
  <RN.Text {...textProps}>{localization.trans(id)}</RN.Text>
);

export const AnimatedMessage = ({
  id,
  ...textProps
}: Omit<Props, 'style'> & {
  style?: any;
}) => (
  <RN.Animated.Text {...textProps}>{localization.trans(id)}</RN.Animated.Text>
);

const linkPattern = /<a href="([^"]*)">(.*?)<\/a>/g;

export const LinkedMessage = ({
  id,
  linkStyle,
  linkIconStyle,
  ...textProps
}: Props & {
  linkStyle?: RN.StyleProp<RN.TextStyle>;
  linkIconStyle?: RN.StyleProp<RN.ImageStyle>;
}) => {
  const text = localization.trans(id);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(linkPattern)) {
    const [whole, url, label] = match;
    const index = match.index ?? 0;
    parts.push(text.slice(lastIndex, index));
    parts.push(
      <RN.Text
        key={index}
        style={[styles.link, linkStyle]}
        accessibilityRole="link"
        onPress={() => RN.Linking.openURL(url)}
      >
        {label}{' '}
        <RN.Image
          source={require('../images/link.svg')}
          style={[styles.icon, linkIconStyle]}
        />
      </RN.Text>,
    );
    lastIndex = index + whole.length;
  }
  parts.push(text.slice(lastIndex));

  return <RN.Text {...textProps}>{parts}</RN.Text>;
};

const styles = RN.StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
  icon: {
    width: 16,
    height: 16,
  },
});

export default Message;
