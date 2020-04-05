import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import { MessageId } from '../../localization';

import Message from './Message';
import shadow from './shadow';
import colors from './colors';
import fonts from './fonts';

type Props = {
  id: MessageId;
  onBack?: () => void | undefined;
};

export default ({ id, onBack }: Props) => {
  return (
    <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
      <RN.View style={styles.content}>
        <RN.TouchableOpacity style={styles.button} onPress={onBack}>
          <RN.Image
            source={require('../images/chevron-left.svg')}
            style={styles.chevron}
          />
        </RN.TouchableOpacity>
        <Message style={styles.screenTitleText} id={id} />
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
    backgroundColor: colors.blue60,
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
    tintColor: colors.white,
  },
  screenTitleText: {
    ...fonts.titleLarge,
    textAlign: 'center',
    color: colors.white,
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
