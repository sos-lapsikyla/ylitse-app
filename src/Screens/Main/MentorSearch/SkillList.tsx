import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import * as mentorState from '../../../state/reducers/mentors';
import * as filterMentorState from '../../../state/reducers/filterMentors';
import * as actions from '../../../state/actions';

import TextButton from '../../components/TextButton';
import colors from '../../components/colors';

type Props = {
  filterString: string;
  height: number;
};

export const SkillList = ({ filterString, height }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const allSkills = useSelector(mentorState.getSkillList);

  const { skillFilter } = useSelector(filterMentorState.selectSearchParams);

  const skillsToShow = allSkills.filter(skill =>
    skill.toLowerCase().includes(filterString.toLowerCase()),
  );

  const onPressSkill = (item: string) => {
    dispatch({ type: 'skillFilter/toggled', payload: { skillName: item } });
  };

  return (
    <RN.View testID="main.searchMentor.skills.view">
      <RN.View>
        <RN.Image
          style={styles.topGradient}
          source={require('../../images/gradient.svg')}
          resizeMode="stretch"
          resizeMethod="scale"
        />
        <RN.ScrollView
          style={{ ...styles.skillContainer, height }}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.contentContainer}
        >
          <RN.View style={styles.chipContainer}>
            {skillsToShow.map(skill => {
              const isSelected = skillFilter.includes(skill);

              return (
                <TextButton
                  key={skill}
                  style={[
                    styles.skillPillCommon,
                    isSelected
                      ? styles.skillPillSelected
                      : styles.skillPillDefault,
                  ]}
                  onPress={() => onPressSkill(skill)}
                  text={skill}
                  textStyle={
                    isSelected
                      ? styles.skillPillSelectedText
                      : styles.skillPillDefaultText
                  }
                  testID={`main.searchMentor.result.${skill}`}
                />
              );
            })}
          </RN.View>
        </RN.ScrollView>
        <RN.Image
          style={styles.bottomGradient}
          source={require('../../images/gradient.svg')}
          resizeMode="stretch"
          resizeMethod="scale"
        />
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  topGradient: {
    height: 40,
    tintColor: colors.background,
    marginBottom: -40,
    width: '100%',
    alignSelf: 'stretch',
    zIndex: 1,
  },
  bottomGradient: {
    height: 40,
    tintColor: colors.background,
    marginTop: -40,
    width: '100%',
    alignSelf: 'stretch',
    transform: [{ rotate: '180deg' }],
    zIndex: 1,
  },
  chipContainer: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentContainer: {
    padding: 0,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  skillContainer: {
    paddingVertical: 12,
    flexShrink: 1,
  },
  skillPillCommon: {
    margin: 4,
    minHeight: 28,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    alignSelf: 'baseline',
    paddingTop: 2,
    paddingBottom: 3,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillPillDefault: {
    backgroundColor: colors.purplePale,
  },
  skillPillSelected: {
    backgroundColor: colors.purple,
  },
  skillPillSelectedText: {
    color: colors.white,
  },
  skillPillDefaultText: {
    color: colors.darkestBlue,
  },
});
