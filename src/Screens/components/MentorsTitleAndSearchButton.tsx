import React from 'react';
import RN from 'react-native';

import * as mentorState from '../../state/reducers/mentors';
import { useSelector } from 'react-redux';

import colors from '../components/colors';
import fonts from '../components/fonts';
import { textShadow } from '../components/shadow';

import * as localization from '../../localization';
import MessageButtonWithIcon from './MessageButtonWithIcon';

interface Props extends RN.TextProps {
  id: localization.MessageId;
  onPress: () => void | undefined;
}

const MentorsTitleAndSearchButton = ({ id, onPress }: Props) => {
  const { message } = useSelector(mentorState.getActiveFilters);

  return (
    <RN.View style={styles.container}>
      <RN.Text style={styles.mentorsTitle}>{localization.trans(id)}</RN.Text>
      <MessageButtonWithIcon
        style={styles.button}
        messageStyle={styles.searchMessage}
        onPress={onPress}
        testID={'main.mentorsTitleAndSearchButton'}
      >
        <RN.Text style={styles.message}>{message}</RN.Text>
      </MessageButtonWithIcon>
    </RN.View>
  );
};

export default MentorsTitleAndSearchButton;

const styles = RN.StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mentorsTitle: {
    marginTop: 24,
    marginBottom: 8,
    ...fonts.titleLarge,
    ...textShadow,
    color: colors.deepBlue,
  },
  button: {
    backgroundColor: colors.white,
    marginTop: 24,
    marginBottom: 8,
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: colors.purple,
    borderWidth: 2,
  },
  searchMessage: {
    color: colors.purple,
  },
  message: {
    ...fonts.regularBold,
    textAlign: 'center',
    color: colors.purple,
    flexDirection: 'column',
    paddingLeft: 5,
  },
});
