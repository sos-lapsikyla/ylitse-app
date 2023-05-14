import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MessageId } from '../../localization';

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
    backgroundColor: colors.lightBlue,
  },
  content: {
    marginTop: 16,
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  button: {
    position: 'absolute',
    left: 8,
    zIndex: 3,
  },
  chevron: {
    tintColor: colors.deepBlue,
  },
  screenTitleText: {
    ...fonts.titleLarge,
    textAlign: 'center',
    color: colors.deepBlue,
  },
  scrollView: {
    zIndex: 1,
    marginTop: -32,
  },
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 320,
    paddingHorizontal: 16,
  },
});
