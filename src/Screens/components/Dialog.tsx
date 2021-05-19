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
  type?: 'warning';
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
      ? [styles.actionButtonWarning, styles.dialogWarning]
      : [styles.actionButtonNormal, styles.dialogNormal];

  return (
    <RN.Modal animationType="fade" transparent={true} visible={true}>
      <RN.View style={styles.background}>
        <RN.View style={[dialogStyle, styles.dialog]}>
          <RN.View style={styles.infoView}>
            <RN.Image
              source={require('../images/alert-circle-outline.svg')}
              style={styles.icon}
            />
            <Message id={textId} style={styles.message} />
          </RN.View>
          <RN.View style={styles.buttonContainer}>
            <Button
              onPress={onPressCancel}
              messageId={'meta.cancel'}
              style={styles.cancelButton}
            />
            <Button
              onPress={onPress}
              messageId={buttonId}
              style={[buttonStyle, styles.button]}
            />
          </RN.View>
        </RN.View>
      </RN.View>
    </RN.Modal>
  );
};

const styles = RN.StyleSheet.create({
  background: {
    backgroundColor: colors.transparentBlack,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  dialog: {
    borderRadius: 16,
    margin: 16,
    padding: 24,
  },
  infoView: {
    flexDirection: 'row',
    marginBottom: 8,
    marginRight: 32,
  },
  message: {
    ...fonts.large,
    marginLeft: 8,
  },
  buttonContainer: { flexDirection: 'row' },
  button: {
    flex: 1,
    margin: 8,
  },
  dialogNormal: {
    backgroundColor: colors.lighterBlue,
  },
  dialogWarning: {
    backgroundColor: colors.warning,
  },
  actionButtonNormal: {
    backgroundColor: colors.blue,
  },
  actionButtonWarning: {
    backgroundColor: colors.red,
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
});
