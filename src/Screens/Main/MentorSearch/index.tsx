import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import * as filterMentorState from '../../../state/reducers/filterMentors';
import * as actions from '../../../state/actions';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '../..';

import useLayout from '../../../lib/use-layout';
import { hasNotch } from '../../../lib/isDevice';

import TitledContainer from '../../components/TitledContainer';
import colors from '../../components/colors';

import CreatedBySosBanner from '../../components/CreatedBySosBanner';
import { BottomActions } from './BottomActions';
import { Filters } from './Filters';
import { SkillList } from './SkillList';
import { Title } from './Title';

export type SearchMentorRoute = {
  'Main/SearchMentor': {};
};

type Props = StackScreenProps<StackRoutes, 'Main/SearchMentor'>;

export default ({ navigation }: Props) => {
  const [skillSearch, setSkillSearch] = React.useState('');
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const { skillFilter } = useSelector(filterMentorState.selectSearchParams);

  const onPressBack = () => {
    if (skillFilter.length > 0) {
      dispatch({
        type: 'statRequest/start',
        payload: { name: 'filter_skills', props: { skills: skillFilter } },
      });
    }

    navigation.goBack();
  };

  const [{ height }, onLayout] = useLayout();

  // Make sure skill area has enough height even when keyboard is showing.
  const padding = hasNotch() ? 50 : 0;
  const some = 380 + padding;
  const min = 250;
  const max = (height || some) - some;
  const skillAreaHeight = max >= min ? max : min;

  return (
    <TitledContainer
      onLayout={onLayout}
      TitleComponent={<Title handleBackPress={onPressBack} />}
      color={colors.darkBlue}
      backgroundColor={colors.white}
    >
      <RN.View style={styles.contentMargins}>
        <Filters skillSearch={skillSearch} setSkillSearch={setSkillSearch} />
        <SkillList height={skillAreaHeight} filterString={skillSearch} />
        <BottomActions
          selectedSkills={skillFilter}
          resetSkillSearch={() => setSkillSearch('')}
          handleBackPress={navigation.goBack}
        />
        <CreatedBySosBanner style={styles.banner} />
      </RN.View>
    </TitledContainer>
  );
};

const styles = RN.StyleSheet.create({
  contentMargins: {
    flex: 1,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  banner: {
    alignSelf: 'center',
  },
});
