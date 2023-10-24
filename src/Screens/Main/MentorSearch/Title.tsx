import React from 'react';
import RN from 'react-native';

import fonts from '../../components/fonts';
import Message from '../../components/Message';

import { textShadow } from '../../components/shadow';
import colors from '../../components/colors';

type Props = {
  handleBackPress: () => void;
};

export const Title = ({ handleBackPress }: Props) => (
  <RN.View style={styles.titleContainer}>
    <RN.TouchableOpacity
      style={styles.backButtonTouchable}
      onPress={handleBackPress}
    >
      <RN.Image
        source={require('../../images/chevron-left.svg')}
        style={styles.backButtonIcon}
      />
    </RN.TouchableOpacity>
    <Message id="main.searchMentor.title" style={styles.titleMessage} />
    <RN.View style={styles.titleBalancer} />
  </RN.View>
);

const styles = RN.StyleSheet.create({
  titleContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButtonTouchable: {
    marginRight: 0,
    marginTop: -8,
    flex: 1,
  },
  backButtonIcon: {
    tintColor: colors.darkestBlue,
    width: 48,
    height: 48,
  },
  titleMessage: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.darkestBlue,
    flex: 6,
  },
  titleBalancer: {
    flex: 1,
  },
});
