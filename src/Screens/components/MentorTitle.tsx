import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';

import * as mentorApi from '../../api/mentors';

import Message from './Message';
import { cardBorderRadius } from './Card';
import colors, { gradients } from './colors';
import fonts from './fonts';

type Props = {
  style?: RN.StyleProp<RN.ViewStyle>;
  mentor: mentorApi.Mentor;
  onPress?: () => void | undefined;
  safeArea?: boolean;
};

const SafeAreaWrapper: React.FC<{}> = ({ children }) => (
  <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
    {children}
  </SafeAreaView>
);

const MentorTitle: React.FC<Props> = ({
  onPress,
  style,
  mentor: { age, name, region },
  safeArea,
}) => {
  const gradientMap: { [i: number]: string[] } = {
    0: gradients.green,
    1: gradients.red,
    2: gradients.orange,
  };
  const gradient: string[] = gradientMap[name.length % 3];
  const Wrapper = safeArea ? SafeAreaWrapper : React.Fragment;
  return (
    <LinearGradient style={[styles.blob, style]} colors={gradient}>
      <Wrapper>
        {!onPress ? null : (
          <RN.TouchableOpacity style={styles.chevronButton} onPress={onPress}>
            <RN.Image
              source={require('../images/chevron-left.svg')}
              style={styles.chevronIcon}
            />
          </RN.TouchableOpacity>
        )}
        <RN.Image
          source={require('../images/user.svg')}
          style={styles.userIcon}
        />
        <RN.View style={styles.column}>
          <RN.Text style={styles.name}>{name}</RN.Text>
          <RN.Text style={styles.infoText}>
            <RN.Text>{age}</RN.Text>
            <Message id={'components.mentorCard.yearsAbbrev'} /> {' | '}
            <RN.Text>{region}</RN.Text>
          </RN.Text>
        </RN.View>
      </Wrapper>
    </LinearGradient>
  );
};

const styles = RN.StyleSheet.create({
  safeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  blob: {
    borderRadius: cardBorderRadius,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  column: {
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  name: {
    ...fonts.titleBold,
  },
  infoText: {
    ...fonts.small,
  },
});

export default MentorTitle;
