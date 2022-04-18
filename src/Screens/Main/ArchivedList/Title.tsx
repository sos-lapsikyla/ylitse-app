import React from 'react';
import RN from 'react-native';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import { textShadow } from '../../components/shadow';
import Message from '../../components/Message';

type Props = {
  onPressBack: () => void | undefined;
};

export const Title: React.FC<Props> = ({ onPressBack }) => {
  return (
    <RN.SafeAreaView style={[styles.titleContainer]}>
      <RN.TouchableOpacity
        onPress={onPressBack}
        testID={'main.archivedList.back.button'}
      >
        <RN.Image
          source={require('../../images/chevron-left.svg')}
          style={styles.backButtonIcon}
        />
      </RN.TouchableOpacity>
      <Message
        id="main.chat.navigation.archived"
        style={styles.screenTitleText}
      />
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  titleContainer: {
    backgroundColor: colors.blue,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonIcon: {
    tintColor: colors.white,
    marginLeft: 16,
    width: 48,
    height: 48,
  },
  screenTitleText: {
    marginVertical: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    marginRight: 32,
    color: colors.white,
    flexGrow: 1,
  },
});
