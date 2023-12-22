import React from 'react';
import RN from 'react-native';

import * as localization from '../../../localization';

import Message from '../Message';
import Button from '../Button';

import colors from '../colors';
import fonts from '../fonts';
import shadow from '../shadow';

import { AlertVariant } from '../Toast';
import { props as modalProps } from './modalProps';

type Props = {
  style?: RN.StyleProp<RN.ViewStyle>;
  title: localization.MessageId;
  messageId: localization.MessageId;
  modalType: AlertVariant;
  primaryButtonMessage?: localization.MessageId;
  secondaryButtonMessage?: localization.MessageId;
  onSecondaryPress?: () => void;
  onPrimaryPress?: () => void;
};

const Modal: React.FC<Props> = props => {
  const { backgroundColor, icon } = modalProps[props.modalType];

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
          <RN.View style={[props.style, styles.modalContainer]}>
            <RN.View style={[styles.titleContainer, { backgroundColor }]}>
              <RN.Image style={styles.image} source={icon} />
              <Message id={props.title} style={styles.title} />
            </RN.View>

            <RN.View style={styles.textContainer}>
              <Message id={props.messageId} style={styles.text} />
            </RN.View>

            <RN.View style={[styles.buttonContainer, justifyButtons]}>
              {props.onSecondaryPress && (
                <Button
                  onPress={props.onSecondaryPress}
                  messageId={props.secondaryButtonMessage ?? 'meta.ok'}
                  style={[styles.button, styles.secondaryButton]}
                  emphasis="low"
                />
              )}
              {props.onPrimaryPress && (
                <Button
                  onPress={props.onPrimaryPress}
                  messageId={
                    props.primaryButtonMessage ?? 'components.remoteData.retry'
                  }
                  style={[styles.button, styles.primaryButton]}
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
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 16,
    ...shadow(7),
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  textContainer: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    color: colors.darkestBlue,
    ...fonts.titleBold,
  },
  text: {
    color: colors.darkestBlue,
    ...fonts.large,
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    tintColor: colors.darkestBlue,
    width: 32,
    height: 32,
  },
  button: {
    flex: 1,
  },
  secondaryButton: { marginRight: 12 },
  primaryButton: { marginLeft: 12 },
});

export default Modal;
