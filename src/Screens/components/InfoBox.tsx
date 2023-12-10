import React from 'react';
import RN from 'react-native';

import { MessageId } from '../../localization';

import colors from './colors';
import fonts from './fonts';
import Message from './Message';

interface InfoBoxProps extends RN.ViewProps {
  messageId: MessageId;
  color?: string;
}

export default ({ style, color, messageId, ...viewProps }: InfoBoxProps) => (
  <RN.View {...viewProps} style={styles.container}>
    <RN.View style={styles.pillar}></RN.View>
    <RN.View style={styles.infoBox}>
      <Message id={messageId} style={styles.infoText} />
    </RN.View>
  </RN.View>
);

const styles = RN.StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
  },
  pillar: {
    width: 8,
    backgroundColor: colors.blue,
  },
  infoBox: {
    padding: 16,
    backgroundColor: colors.whiteBlue,
  },
  infoText: {
    ...fonts.subtitle,
    color: colors.darkestBlue,
  },
});
