import React from 'react';
import RN from 'react-native';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import { textShadow } from '../../components/shadow';

import Message from '../../components/Message';

type Props = {
  openDropdown: () => void | undefined;
  onLayout: (e: RN.LayoutChangeEvent) => void | undefined;
};

export const Title: React.FC<Props> = ({ openDropdown, onLayout }) => {
  return (
    <RN.SafeAreaView style={[styles.shadow]} onLayout={onLayout}>
      <RN.View style={styles.spacer} />
      <Message id="buddyList.title" style={styles.screenTitleText} />
      <RN.TouchableHighlight
        style={styles.kebabIconHighlight}
        underlayColor={colors.faintBackground}
        testID={'main.buddylist.kebabicon'}
        onPress={openDropdown}
      >
        <RN.Image
          source={require('../../images/three-dot-menu.svg')}
          style={styles.kebabIcon}
        />
      </RN.TouchableHighlight>
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  shadow: {
    backgroundColor: colors.blue,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 2,
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: { height: 40, width: 40 },
  screenTitleText: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.white,
  },
  kebabIconHighlight: {
    height: 32,
    width: 32,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kebabIcon: { tintColor: colors.white },
});
