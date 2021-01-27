import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import * as navigationProps from '../../lib/navigation-props';

import * as actions from '../../state/actions';

import fonts from '../components/fonts';
import Message from '../components/Message';
import * as localization from '../../localization';

import MessageButton from '../components/MessageButton';
import TextButton from '../components/TextButton';
import TitledContainer from '../components/TitledContainer';
import { textShadow } from '../components/shadow';
import colors, { gradients } from '../components/colors';

import * as mentorState from '../../state/reducers/mentors';
import { MentorListRoute } from './MentorList';

import CreatedBySosBanner from '../components/CreatedBySosBanner';


export type SearchMentorRoute = {
  'Main/SearchMentor': {};
};

type Props = navigationProps.NavigationProps<
  SearchMentorRoute,
  MentorListRoute
>;

export default ({ navigation }: Props) => {
  const [skillSearch, setSkillSearch] = React.useState('');
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  
  const allSkills = useSelector(mentorState.getSkillList);
  const selectedSkills = useSelector(mentorState.getSelectedSkills);
  const skillsToShow = allSkills.filter(skill => skill.toLowerCase().includes(skillSearch.toLowerCase()));


  const onPressBack = () => {
    navigation.goBack();
  };

  const onPressSkill = (item: string) => {
    dispatch({ type: 'skillFilter/toggled', payload: {skillName: item}});
  };

  const onPressReset = () => {
    dispatch({ type: 'skillFilter/reset', payload: undefined });
  };

  const maxHeight = RN.Dimensions.get('window').height - 350;

  return (
    <TitledContainer
      TitleComponent={
        <RN.View style={styles.titleContainer}>
          <RN.TouchableOpacity
            style={styles.backButtonTouchable}
            onPress={onPressBack}
          >
            <RN.Image
              source={require('../images/chevron-left.svg')}
              style={styles.backButtonIcon}
            />
          </RN.TouchableOpacity>
          <Message id="main.searchMentor.title" style={styles.titleMessage} />
          <RN.View style={styles.titleBalancer} />
        </RN.View>
      }
      gradient={gradients.pillBlue}
    >
      <RN.View style={styles.contentMargins}>
        <RN.View style={styles.searchContainer}>
          <RN.TextInput
            style={styles.searchField}
            editable={true}
            onChangeText={setSkillSearch}
            value={skillSearch}
            placeholder={localization.trans(
              'main.searchMentor.searchField.placeholder',
            )}
            placeholderTextColor={colors.lightGray}
            testID="main.searchMentor.searchField"
          />
          <RN.Image
            style={styles.icon}
            source={require('../images/search.svg')}
            resizeMode="stretch"
            resizeMethod="scale"
          />
        </RN.View>

        <RN.View testID="main.searchMentor.skills.view">
            <RN.View>
              <RN.Image
                style={styles.topGradient}
                source={require('../images/gradient.svg')}
                resizeMode="stretch"
                resizeMethod="scale"
              />
              <RN.ScrollView
                style={{ ...styles.carouselContainer, height: maxHeight }}
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={styles.contentContainer}
              >
                <RN.View style={styles.chipContainer}>
                  {skillsToShow.map(skill => {
                    const isSelected = selectedSkills.includes(skill);

                    return (
                      <TextButton
                        key={skill}
                        style={
                          isSelected
                            ? styles.skillPillButtonSelected
                            : styles.skillPillButton
                        }
                        onPress={() => onPressSkill(skill)}
                        text={skill}
                        textStyle={styles.skillPillButtonText}
                        testID={`main.searchMentor.result.${skill}`}
                      />
                    );
                  })}
                </RN.View>
              </RN.ScrollView>
              <RN.Image
                style={styles.bottomGradient}
                source={require('../images/gradient.svg')}
                resizeMode="stretch"
                resizeMethod="scale"
              />
            </RN.View>
        </RN.View>

        <RN.View style={styles.searcResetContainer}>
          <MessageButton
            style={styles.resetButton}
            messageStyle={styles.resetButtonText}
            onPress={onPressReset}
            messageId={'main.searchMentor.resetButton'}
            testID={'main.searchMentor.resetButton'}
          />
          <MessageButton
            style={styles.searchButton}
            onPress={onPressBack}
            messageId={'main.searchMentor.showButton'}
            testID={'main.searchMentor.showButton'}
          />
        </RN.View>
      </RN.View>
      <CreatedBySosBanner style={styles.banner} />
    </TitledContainer>
  );
};

const styles = RN.StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentMargins: {
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  titleBalancer: {
    flex: 1,
  },
  titleMessage: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.white,
    flex: 6,
  },
  backButtonIcon: {
    tintColor: colors.white,
    width: 48,
    height: 48,
  },
  backButtonTouchable: {
    marginRight: 0,
    marginTop: -8,
    flex: 1,
  },
  titleContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topGradient: {
    height: 40,
    tintColor: '#EFF5F9',
    marginBottom: -40,
    width: '100%',
    alignSelf: 'stretch',
    zIndex: 1,
  },
  bottomGradient: {
    height: 40,
    tintColor: colors.white,
    marginTop: -40,
    width: '100%',
    alignSelf: 'stretch',
    transform: [{ rotate: '180deg' }],
    zIndex: 1,
  },
  chipContainer: {
    marginTop: 30,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentContainer: {
    padding: 0,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  carouselContainer: {
    flexShrink: 1,
  },
  icon: {
    tintColor: colors.lightGray,
    height: 35,
    width: 35,
    position: 'relative',
    marginLeft: -40,
    marginTop: 3,
  },
  searchField: {
    flex: 1,
    borderColor: colors.lightBluishGray,
    borderWidth: 1,
    backgroundColor: colors.faintGray,
    height: 40,

    ...fonts.largeBold,
    color: colors.deepBlue,
    alignSelf: 'stretch',
    flexGrow: 1,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 48,
    borderRadius: 16,
  },
  skillPillButton: {
    backgroundColor: colors.veryFaintBlue,
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
  skillPillButtonSelected: {
    backgroundColor: colors.cyan,
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
  skillPillButtonText: {
    color: colors.white,
  },
  searchButton: {
    backgroundColor: colors.slightlyDesaturatedGreen,
    marginBottom: 40,
  },
  resetButton: { backgroundColor: colors.lightGrayishBlue, marginBottom: 40 },
  resetButtonText: { color: colors.veryDarkBlue },
  searcResetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  banner: {
    alignSelf: 'center',
  },
});
