import React from 'react';
import RN from 'react-native';

import colors from '../colors';
import fonts from '../fonts';

import { borderRadius } from './index';

type Props = { title: string; onClose: () => void };

export const Title: React.FC<Props> = ({ title, onClose }) => (
  <RN.View style={styles.titleContainer}>
    <RN.TouchableOpacity
      onPress={onClose}
      style={styles.closeButton}
      testID="questionModal.close.icon"
    >
      <RN.Image source={require('../../images/close.svg')} />
    </RN.TouchableOpacity>
    <RN.Text style={styles.titleText}>{title}</RN.Text>
  </RN.View>
);

const styles = RN.StyleSheet.create({
  titleContainer: {
    borderRadius,
    flexDirection: 'column',
    backgroundColor: colors.blue,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginRight: 12,
    marginTop: 12,
  },
  titleText: {
    ...fonts.large,
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingBottom: 24,
  },
});
