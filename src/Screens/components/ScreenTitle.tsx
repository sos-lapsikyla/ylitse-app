import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MessageId } from '../../localization';
import { hasNotch } from '../../lib/isDevice';

import Message from './Message';
import shadow from './shadow';
import colors from './colors';
import fonts from './fonts';

type Props = {
  id: MessageId;
  onBack?: () => void | undefined;
  style?: RN.StyleProp<RN.ViewStyle>;
  textStyle?: RN.StyleProp<RN.TextStyle>;
  iconStyle?: RN.StyleProp<RN.ImageStyle>;
};

export default ({ id, onBack, style, textStyle, iconStyle }: Props) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <RN.View style={styles.content}>
        <RN.TouchableOpacity style={styles.button} onPress={onBack}>
          <RN.Image
            source={require('../images/chevron-left.svg')}
            style={[styles.chevron, iconStyle]}
          />
        </RN.TouchableOpacity>
        <Message style={[styles.screenTitleText, textStyle]} id={id} />
      </RN.View>
    </SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    ...shadow,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 2,
    backgroundColor: colors.darkBlue,
  },
  content: {
    marginVertical: hasNotch() ? 0 : 16,
    alignSelf: 'stretch',
  },
  button: {
    position: 'absolute',
    left: 8,
    zIndex: 3,
  },
  chevron: {
    tintColor: colors.darkestBlue,
  },
  screenTitleText: {
    ...fonts.titleLarge,
    textAlign: 'center',
    color: colors.darkestBlue,
  },
});
