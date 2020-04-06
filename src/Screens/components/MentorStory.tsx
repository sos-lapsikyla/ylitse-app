import React from 'react';
import RN from 'react-native';

import colors from './colors';
import fonts from './fonts';

type Props = {
  story: string;
  style?: RN.StyleProp<RN.ViewStyle>;
  showAll: boolean;
};

const MentorStory = ({ style, story, showAll }: Props) => {
  const numberOfLines = showAll ? undefined : 5;
  return (
    <RN.View style={[styles.container, style]}>
      <RN.Text style={styles.story} numberOfLines={numberOfLines}>
        {story}
      </RN.Text>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {},
  title: {
    ...fonts.regularBold,
    color: colors.deepBlue,
    marginBottom: 8,
  },
  story: {
    ...fonts.regular,
    color: colors.deepBlue,
  },
});

export default MentorStory;
