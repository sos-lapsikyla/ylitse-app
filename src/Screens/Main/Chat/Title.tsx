import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';
import * as ReactRedux from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import * as state from '../../../state';
import * as selectors from '../../../state/selectors';

import colors, { gradients } from '../../components/colors';
import { cardBorderRadius } from '../../components/Card';
import fonts from '../../components/fonts';
import shadow from '../../components/shadow';

type StateProps = {
  name: string;
};
type DispatchProps = {};
type OwnProps = {
  style?: RN.StyleProp<RN.ViewStyle>;
  onPress: () => void | undefined;
  buddyId: string;
};
type Props = OwnProps & DispatchProps & StateProps;

const Title: React.FC<Props> = ({ style, onPress, name }) => {
  const gradientMap: { [i: number]: string[] } = {
    0: gradients.green,
    1: gradients.red,
    2: gradients.orange,
  };
  const gradient: string[] = gradientMap[name.length % 3];
  return (
    <LinearGradient style={[styles.blob, style]} colors={gradient}>
      <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
        {!onPress ? null : (
          <RN.TouchableOpacity style={styles.chevronButton} onPress={onPress}>
            <RN.Image
              source={require('../../images/chevron-left.svg')}
              style={styles.chevronIcon}
            />
          </RN.TouchableOpacity>
        )}
        <RN.Image
          source={require('../../images/user.svg')}
          style={styles.userIcon}
        />
        <RN.Text style={styles.name}>{name}</RN.Text>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = RN.StyleSheet.create({
  blob: {
    borderBottomRightRadius: cardBorderRadius,
    borderBottomLeftRadius: cardBorderRadius,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  safeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chevronButton: {
    marginRight: 16,
    marginLeft: 0,
  },
  chevronIcon: {
    tintColor: colors.black,
    width: 48,
    height: 48,
  },
  userIcon: {
    tintColor: colors.black,
    width: 64,
    height: 64,
    marginRight: 16,
  },
  name: {
    ...fonts.titleBold,
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.AppState
>(({ mentors, buddies }, { buddyId }) => {
  return { name: selectors.getBuddyName(buddyId, buddies, mentors) };
})(Title);
