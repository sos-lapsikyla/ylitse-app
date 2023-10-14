import React from 'react';
import RN from 'react-native';

import colors from 'src/Screens/components/colors';
import Button from 'src/Screens/components/Button';
import IconButton from 'src/Screens/components/IconButton';

type Props = {
  onBack: () => void;
  onSend: () => void;
  isSendDisabled: boolean;
};

export const BottomActions = ({ onBack, onSend, isSendDisabled }: Props) => (
  <RN.View style={styles.bottomActions}>
    <IconButton
      style={styles.backButtonTouchable}
      onPress={onBack}
      testID="main.userreport.back.button"
      badge={require('../../images/chevron-left.svg')}
      badgeStyle={styles.badge}
    />
    <Button
      style={styles.sendButton}
      onPress={onSend}
      messageId="main.userreport.send.button"
      disabled={isSendDisabled}
    />
  </RN.View>
);

const styles = RN.StyleSheet.create({
  bottomActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  backButtonTouchable: {
    borderRadius: 50,
  },
  backButtonIcon: {
    tintColor: colors.black,
    marginRight: 4,
    width: 48,
    height: 48,
  },
  sendButton: {
    paddingHorizontal: 64,
  },
  badge: {
    width: 32,
    height: 32,
  },
});
