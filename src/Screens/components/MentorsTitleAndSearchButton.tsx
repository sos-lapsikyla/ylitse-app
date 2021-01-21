import React from 'react';
import RN from 'react-native';

import colors from '../components/colors';
import fonts from '../components/fonts';
import { textShadow } from '../components/shadow';

import * as localization from '../../localization';
import MessageButtonWithIcon from './MessageButtonWithIcon';

interface Props extends RN.TextProps {
  id: localization.MessageId;
  onPress: () => void | undefined;
}

const MentorsTitleAndSearchButton = ({ id, onPress }: Props) => (
  <RN.View style={styles.container}>
    <RN.Text style={styles.mentorsTitle}>{localization.trans(id)}</RN.Text>
    <MessageButtonWithIcon
      style={styles.searchButton}
      messageStyle={styles.searchMessage}
      onPress={onPress}
      messageId={'main.mentorsTitleAndSearchButton'}
      testID={'main.mentorsTitleAndSearchButton'}
    />
  </RN.View>
);

export default MentorsTitleAndSearchButton;

const styles = RN.StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  searchButton: {
    backgroundColor: colors.faintGray,
    marginTop: 24,
    marginBottom: 8,
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchMessage: {
    color: colors.deepBlue,
  },
  mentorsTitle: {
    marginTop: 24,
    marginBottom: 8,
    ...fonts.titleLarge,
    ...textShadow,
    color: colors.white,
  },
});
