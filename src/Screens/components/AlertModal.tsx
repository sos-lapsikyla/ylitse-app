import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import Button from './Button';

import colors from './colors';
import fonts from './fonts';
import shadow from './shadow';

import { AlertVariant } from './Toast';
import { props as alertProps } from './alertProps';

type Props = {
  style?: RN.StyleProp<RN.ViewStyle>;
  messageId: localization.MessageId;
  modalType: AlertVariant;
  primaryButtonMessage?: localization.MessageId;
  secondaryButtonMessage?: localization.MessageId;
  onSecondaryPress?: () => void;
  onPrimaryPress?: () => void;
};

export const AlertModal: React.FC<Props> = props => {
  const { backgroundColor, tintColor, icon, secondaryButton, primaryButton } =
    alertProps[props.modalType];

  const hasTwoCallbacks =
    typeof props.onSecondaryPress !== 'undefined' &&
    typeof props.onPrimaryPress !== 'undefined';

  const justifyButtons = {
    justifyContent: hasTwoCallbacks ? 'space-between' : 'center',
  } as const;

  return (
    <RN.View style={styles.container}>
      <RN.Modal animationType="fade" transparent={true} visible={true}>
        <RN.View style={styles.background}>
          <RN.View
            style={[props.style, styles.modalContainer, { backgroundColor }]}
          >
            <RN.View style={styles.textContainer}>
              <RN.Image style={[styles.image, { tintColor }]} source={icon} />
              <Message id={props.messageId} style={styles.text} />
            </RN.View>

            <RN.View style={[styles.buttonContainer, justifyButtons]}>
              {props.onSecondaryPress && (
                <Button
                  onPress={props.onSecondaryPress}
                  messageStyle={styles.secondaryButtonText}
                  messageId={props.secondaryButtonMessage ?? 'meta.ok'}
                  style={[
                    styles.button,
                    styles.secondaryButton,
                    { backgroundColor: secondaryButton },
                  ]}
                />
              )}
              {props.onPrimaryPress && (
                <Button
                  onPress={props.onPrimaryPress}
                  messageStyle={styles.buttonText}
                  messageId={
                    props.primaryButtonMessage ?? 'components.remoteData.retry'
                  }
                  style={[
                    styles.button,
                    styles.primaryButton,
                    { backgroundColor: primaryButton },
                  ]}
                />
              )}
            </RN.View>
          </RN.View>
        </RN.View>
      </RN.Modal>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    backgroundColor: colors.transparentBlack,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  modalContainer: {
    marginHorizontal: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    ...shadow(7),
  },
  textContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    color: colors.darkestBlue,
    ...fonts.large,
    marginLeft: 24,
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
  button: {
    flex: 1,
  },
  secondaryButton: { marginRight: 12 },
  primaryButton: { marginLeft: 12 },
  buttonText: {
    color: colors.darkestBlue,
    ...fonts.regularBold,
  },
  secondaryButtonText: { color: colors.darkestBlue, ...fonts.regular },
});
