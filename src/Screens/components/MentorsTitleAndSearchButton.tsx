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
  const { kind, message } = useSelector(mentorState.getActiveFilters);

  const { buttonStyle, messageStyle } = {
    NoFilters: {
      buttonStyle: styles.noFilterButton,
      messageStyle: styles.noFilterMessage,
    },
    FiltersActive: {
      buttonStyle: styles.filterButton,
      messageStyle: styles.filterMessage,
    },
  }[kind];

  return (
    <RN.View style={styles.container}>
      <RN.Text style={styles.mentorsTitle}>{localization.trans(id)}</RN.Text>
      <MessageButtonWithIcon
        style={buttonStyle}
        messageStyle={styles.searchMessage}
        onPress={onPress}
        testID={'main.mentorsTitleAndSearchButton'}
      >
        <RN.Text style={messageStyle}>{message}</RN.Text>
      </MessageButtonWithIcon>
    </RN.View>
  );
};

export default MentorsTitleAndSearchButton;

const styles = RN.StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: colors.darkestBlue,
    marginTop: 24,
    marginBottom: 8,
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noFilterButton: {
    backgroundColor: colors.lightestGray,
    marginTop: 24,
    marginBottom: 8,
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchMessage: {
    color: colors.darkestBlue,
  },

  mentorsTitle: {
    marginTop: 24,
    marginBottom: 8,
    ...fonts.titleLarge,
    ...textShadow,
    color: colors.white,
  },
  filterMessage: {
    ...fonts.regularBold,

    textAlign: 'center',
    color: colors.white,
    flexDirection: 'column',
    paddingLeft: 5,
  },
  noFilterMessage: {
    ...fonts.regularBold,
    textAlign: 'center',
    color: colors.darkestBlue,
    flexDirection: 'column',
    paddingLeft: 5,
  },
});
