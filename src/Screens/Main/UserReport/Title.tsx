import React from 'react';
import RN from 'react-native';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import { textShadow } from '../../components/shadow';

import Message from '../../components/Message';

type Props = { onBack: () => void };

export const Title: React.FC<Props> = ({ onBack }) => {
  return (
    <RN.SafeAreaView style={[styles.shadow]}>
      <RN.TouchableOpacity style={styles.backButtonTouchable} onPress={onBack}>
        <RN.Image
          source={require('../../images/chevron-left.svg')}
          style={styles.backButtonIcon}
        />
      </RN.TouchableOpacity>
      <Message id="main.userreport.title" style={styles.screenTitleText} />
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  shadow: {
    backgroundColor: colors.darkBlue,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 2,
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonTouchable: {
    position: 'absolute',
    left: 8,
  },
  backButtonIcon: {
    tintColor: colors.darkestBlue,
    width: 48,
    height: 48,
  },
  screenTitleText: {
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.darkestBlue,
  },
});
