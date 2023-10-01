import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch } from 'react-redux';

import * as actions from '../../../state/actions';

import MessageButton from '../../components/MessageButton';
import colors from '../../components/colors';

type Props = {
  selectedSkills: Array<string>;
  resetSkillSearch: () => void;
  handleBackPress: () => void;
};

export const BottomActions = ({
  selectedSkills,
  resetSkillSearch,
  handleBackPress,
}: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const onPressBack = () => {
    if (selectedSkills.length > 0) {
      dispatch({
        type: 'statRequest/start',
        payload: { name: 'filter_skills', props: { skills: selectedSkills } },
      });
    }

    handleBackPress();
  };

  const onPressReset = () => {
    resetSkillSearch();
    dispatch({ type: 'skillFilter/reset', payload: undefined });
  };

  return (
    <RN.View style={styles.searcResetContainer}>
      <MessageButton
        style={styles.button}
        onPress={onPressReset}
        messageId={'main.searchMentor.resetButton'}
        testID={'main.searchMentor.resetButton'}
        emphasis="low"
      />
      <MessageButton
        style={styles.button}
        onPress={onPressBack}
        messageId={'main.searchMentor.showButton'}
        testID={'main.searchMentor.showButton'}
      />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  button: {
    marginBottom: 40,
    paddingHorizontal: 32,
  },
  searcResetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
