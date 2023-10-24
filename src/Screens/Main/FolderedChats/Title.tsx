import React from 'react';
import RN from 'react-native';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import { textShadow } from '../../components/shadow';
import Message from '../../components/Message';
import { MessageId } from 'src/localization/fi';
import { FolderType } from './folderedChatProperties';

type Props = {
  openDropdown: () => void | undefined;
  onLayout: (e: RN.LayoutChangeEvent) => void | undefined;
  onPressBack: () => void | undefined;
  headerId: MessageId;
  folderType: FolderType;
};

export const Title: React.FC<Props> = ({
  openDropdown,
  onLayout,
  onPressBack,
  headerId,
  folderType,
}) => {
  return (
    <RN.SafeAreaView
      style={[
        styles.shadow,
        {
          backgroundColor:
            folderType === 'banned' ? colors.red : colors.orangeLight,
        },
      ]}
      onLayout={onLayout}
    >
      <RN.TouchableOpacity
        onPress={onPressBack}
        testID={'main.folderedlist.back.button'}
      >
        <RN.Image
          source={require('../../images/chevron-left.svg')}
          style={styles.backButtonIcon}
        />
      </RN.TouchableOpacity>
      <Message id={headerId} style={styles.screenTitleText} />
      <RN.TouchableHighlight
        style={styles.kebabIconHighlight}
        underlayColor={colors.faintBackground}
        testID={'main.folderedlist.kebabicon'}
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
  screenTitleText: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.darkestBlue,
  },
  backButtonIcon: {
    tintColor: colors.darkestBlue,
    width: 48,
    height: 48,
  },
  kebabIconHighlight: {
    height: 32,
    width: 32,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kebabIcon: {
    tintColor: colors.darkestBlue,
  },
});
