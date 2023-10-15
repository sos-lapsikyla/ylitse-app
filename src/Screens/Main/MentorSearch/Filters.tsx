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
import InputField from 'src/Screens/components/InputField';

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
      <InputField
        editable={true}
        onChangeText={setSkillSearch}
        value={skillSearch}
        placeholder={localization.trans(
          'main.searchMentor.searchField.placeholder',
        )}
        placeholderTextColor={colors.blueGray}
        testID="main.searchMentor.searchField"
        icon={require('../../images/search.svg')}
      />

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
  hideInactiveSwitch: {
    paddingTop: 16,
  },
  switchMessage: {
    ...fonts.regular,
    color: colors.blueGray,
  },
});
