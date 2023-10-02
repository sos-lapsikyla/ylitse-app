import React from 'react';
import RN from 'react-native';

import colors from '../colors';
import fonts from '../fonts';

import { borderRadius } from './index';

type Props = { title: string; onClose: () => void };

export const Title: React.FC<Props> = ({ title, onClose }) => (
  <RN.View style={styles.titleContainer}>
    <RN.Text style={styles.titleText}>{title}</RN.Text>
    <RN.TouchableOpacity
      onPress={onClose}
      style={styles.closeButton}
      testID="questionModal.close.icon"
    >
      <RN.Image
        source={require('../../images/close.svg')}
        style={styles.closeIcon}
      />
    </RN.TouchableOpacity>
  </RN.View>
);

const styles = RN.StyleSheet.create({
  titleContainer: {
    borderRadius,
    backgroundColor: colors.purple,
  },
  closeIcon: {
    width: 16,
    height: 16,
    tintColor: colors.purple,
  },
  closeButton: {
    position: 'absolute',
    right: 4,
    top: 4,
    padding: 10,
    borderRadius: 32,
    backgroundColor: colors.purplePale,
  },
  titleText: {
    ...fonts.questionTitle,
    textAlign: 'center',
    marginHorizontal: 48,
    paddingVertical: 16,
    color: colors.white,
  },
});
