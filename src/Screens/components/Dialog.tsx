import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import colors from './colors';
import fonts from './fonts';
import Button from 'src/Screens/components/Button';

interface Props {
  textId: localization.MessageId;
  buttonId: localization.MessageId;
  onPressCancel: () => void | undefined;
  onPress: () => void | undefined;
  type?: 'warning' | undefined;
  testID?: string;
}

export const Dialog = ({
  textId,
  buttonId,
  onPressCancel,
  onPress,
  type,
}: Props) => {
  const [buttonStyle, dialogStyle] =
    type === 'warning'
      ? [styles.buttonWarning, styles.dialogWarning]
      : [styles.button, styles.dialog];
      
  return (
    <RN.Modal animationType="fade" transparent={true} visible={true}>
      <RN.View style={styles.background}>
        <RN.View style={dialogStyle}>
          <RN.View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <RN.Image source={require('../images/alert-circle-outline.svg')} style={styles.icon} />
            <Message id={textId} style={{ ...fonts.large, marginLeft: 8 }} />
          </RN.View>
          <RN.View style={{ flexDirection: 'row' }}>
            <Button
              onPress={onPressCancel}
              messageId={'meta.cancel'}
              style={styles.cancelButton}
            ></Button>
            <Button
              onPress={onPress}
              messageId={'main.chat.ban'}
              style={buttonStyle}
            ></Button>
          </RN.View>
        </RN.View>
      </RN.View>
    </RN.Modal>
  );
};

const styles = RN.StyleSheet.create({
  dialog: {
    backgroundColor: colors.lightBlue,
    borderRadius: 16,
    margin: 16,
    padding: 24,
  },
  button: {
    backgroundColor: colors.blue,
    flex: 1,
    margin: 8,
  },
  dialogWarning: {
    backgroundColor: colors.lightDanger,
    borderRadius: 16,
    margin: 16,
    padding: 16,
  },
  buttonWarning: {
    backgroundColor: colors.red,
    flex: 1,
    margin: 8,
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
    flex: 1,
    margin: 8,    
  },
  icon: {
    tintColor: colors.darkestBlue,
    width: 48,
    height: 48,
  },
  background: {
    backgroundColor: '#000a',
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
});
