import React from 'react';
import RN from 'react-native';

import * as localization from '../../../../localization';

import Message from '../../../components/Message';
import Button from '../../../components/Button';
import colors from '../../../components/colors';
import fonts from '../../../components/fonts';
import { textShadow } from '../../../components/shadow';

type Props = {
  imageSource: RN.ImageSourcePropType;
  style?: RN.StyleProp<RN.ViewStyle>;
  imageStyle?: RN.StyleProp<RN.ImageStyle>;
  messageId: localization.MessageId;
  onOkPress: () => void;
  onRetryPress: () => void;
};

export default (props: Props) => {
  return (
    <RN.View style={[styles.container, props.style]}>
      <RN.Image
        style={[styles.image, props.imageStyle]}
        source={props.imageSource}
      />
      <Message id={props.messageId} style={styles.text} />
      <RN.View style={styles.buttonContainer}>
        <Button
          onPress={props.onOkPress}
          messageStyle={styles.buttonText}
          messageId="meta.ok"
          style={[styles.button, styles.leftButton]}
        />
        <Button
          onPress={props.onRetryPress}
          messageStyle={styles.buttonText}
          messageId="components.remoteData.retry"
          style={styles.button}
        />
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    padding: 24,
  },
  text: {
    color: colors.darkestBlue,
    ...fonts.largeBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  image: {
    width: 160,
    height: 160,
    tintColor: colors.darkestBlue,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  leftButton: { marginRight: 24 },
  button: {
    backgroundColor: colors.blue,
  },
  buttonText: {
    color: colors.white,
    ...fonts.largeBold,
    ...textShadow,
  },
});
