import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import * as filterMentorState from '../../../state/reducers/filterMentors';
import * as actions from '../../../state/actions';

import fonts from '../../components/fonts';
import * as localization from '../../../localization';

import MessageSwitch from '../../components/MessageSwitch';
import colors from '../../components/colors';

type Props = {
  skillSearch: string;
  setSkillSearch: (nextFilter: string) => void;
};

export const Filters = ({ skillSearch, setSkillSearch }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const { shouldHideInactiveMentors } = useSelector(
    filterMentorState.selectSearchParams,
  );

  const onHideInactiveMentors = () => {
    dispatch({ type: 'onHideInactiveMentors/toggle', payload: undefined });
  };

  return (
    <RN.View>
      <RN.View style={styles.searchContainer}>
        <RN.TextInput
          style={styles.searchField}
          editable={true}
          onChangeText={setSkillSearch}
          value={skillSearch}
          placeholder={localization.trans(
            'main.searchMentor.searchField.placeholder',
          )}
          placeholderTextColor={colors.blueGray}
          testID="main.searchMentor.searchField"
        />
        <RN.Image
          style={styles.searchIcon}
          source={require('../../images/search.svg')}
          resizeMode="stretch"
          resizeMethod="scale"
        />
      </RN.View>

      <RN.View style={styles.hideInactiveSwitch}>
        <MessageSwitch
          onPress={onHideInactiveMentors}
          value={shouldHideInactiveMentors}
          testID={'main.searchMentor.shouldHideInactiveMentors'}
          messageOn={'main.searchMentor.shouldHideInactiveMentors'}
          messageOff={'main.searchMentor.shouldHideInactiveMentors'}
          messageStyle={styles.switchMessage}
        />
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchIcon: {
    tintColor: colors.purple,
    height: 24,
    width: 24,
    position: 'relative',
    marginLeft: -40,
    marginTop: 8,
  },
  hideInactiveSwitch: {
    paddingTop: 16,
  },
  switchMessage: {
    ...fonts.regular,
    color: colors.blueGray,
  },
  searchField: {
    flex: 1,
    borderColor: colors.purple,
    borderWidth: 1,
    backgroundColor: colors.white,
    height: 40,
    ...fonts.regular,
    color: colors.darkestBlue,
    alignSelf: 'stretch',
    flexGrow: 1,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 48,
    borderRadius: 16,
  },
});
