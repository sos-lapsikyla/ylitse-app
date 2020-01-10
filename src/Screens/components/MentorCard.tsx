import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import colors from './colors';
import Shadow from './Shadow';

interface Props {
  style?: RN.StyleProp<RN.ViewStyle>;
}

const MentorCard: React.FC<Props> = ({ children, style }) => (
  <Shadow style={[styles.container, style]}>
    <LinearGradient
      style={styles.blob}
      colors={[colors.darkTeal, colors.lightTeal]}
    >
      <RN.Image
        source={require('../images/user.svg')}
        style={styles.userIcon}
      />
      <RN.View style={styles.column}>
        <RN.Text>Matti-Pekka</RN.Text>
        <RN.Text>28 v. | Kuusamo, Perahikia </RN.Text>
      </RN.View>
    </LinearGradient>
    <RN.View style={styles.contentContainer}>
      <RN.Text>JANTERI</RN.Text>
      {children}
    </RN.View>
  </Shadow>
);

const styles = RN.StyleSheet.create({
  container: { borderRadius: 30, backgroundColor: colors.white },
  blob: {
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  userIcon: {
    tintColor: colors.black,
    width: 64,
    height: 64,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 24,
  },
  contentContainer: {
    padding: 24,
  },
});

export default MentorCard;
