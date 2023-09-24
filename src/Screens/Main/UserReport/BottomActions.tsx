import React from 'react';
import RN from 'react-native';

import colors from 'src/Screens/components/colors';
import Button from 'src/Screens/components/Button';

type Props = {
  onBack: () => void;
  onSend: () => void;
  isSendDisabled: boolean;
};

export const BottomActions = ({ onBack, onSend, isSendDisabled }: Props) => (
  <RN.View style={styles.bottomActions}>
    <RN.TouchableOpacity
      style={styles.backButtonTouchable}
      onPress={onBack}
      testID="main.userreport.back.button"
    >
      <RN.Image
        source={require('../../images/chevron-left.svg')}
        style={styles.backButtonIcon}
      />
    </RN.TouchableOpacity>
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
    marginTop: 16,
  },
  backButtonTouchable: {
    backgroundColor: colors.blue,
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
});
