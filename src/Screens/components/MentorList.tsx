import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';

import * as mentorApi from '../../api/mentors';
import * as actions from '../../state/actions';
import * as mentorState from '../../state/reducers/mentors';
import * as filterMentorState from '../../state/reducers/filterMentors';
import * as tokenState from '../../state/reducers/accessToken';

import useLayout from '../../lib/use-layout';
import { isDevice } from '../../lib/isDevice';

import MentorCard from '../components/MentorCard';
import RemoteData from '../components/RemoteData';

type Props = {
  onPress?: (mentor: mentorApi.Mentor) => void | undefined;
  testID?: string;
};

export default ({ onPress, testID }: Props) => {
  const userId = useSelector(tokenState.getUserId);

  const { shouldHideInactiveMentors, skillFilter } = useSelector(
    filterMentorState.selectSearchParams,
  );
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const fetchMentors = () => {
    dispatch({ type: 'mentors/start', payload: undefined });
  };

  const filterSameIdAndSelectedSkills = (
    mentor: mentorApi.Mentor,
    skills: string[],
  ) => {
    return skills.length > 0 && mentor.buddyId !== userId
      ? mentor.skills.filter(e => skills.includes(e)).length > 0
      : mentor.buddyId !== userId;
  };

  const filterOutVacationingIfNeeded = (
    mentor: mentorApi.Mentor,
    showVacation: boolean,
  ) => {
    return showVacation ? !mentor.is_vacationing : true;
  };

  const mentorList = RD.remoteData.map(useSelector(mentorState.get), mentors =>
    mentors
      .filter(mentor => filterSameIdAndSelectedSkills(mentor, skillFilter))
      .filter(mentor =>
        filterOutVacationingIfNeeded(mentor, shouldHideInactiveMentors),
      ),
  );
  const [{ width, height }, onLayout] = useLayout();
  const measuredWidth = width || RN.Dimensions.get('window').width;

  const interval = measuredWidth * (0.85 + 0.15 / 4);

  const deccelerationRate = isDevice('ios') ? 0.99 : 0.8;

  return (
    <RN.View
      onLayout={onLayout}
      style={styles.mentorListContainer}
      testID={testID}
    >
      <RemoteData data={mentorList} fetchData={fetchMentors}>
        {mentors => (
          <RN.View style={styles.carouselContainer}>
            <RN.FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              initialNumToRender={2}
              decelerationRate={deccelerationRate}
              snapToInterval={interval}
              contentContainerStyle={{
                paddingLeft: (0.15 / 2) * measuredWidth,
              }}
              data={[...mentors].sort(mentorApi.compare(userId))}
              renderItem={renderMentorCard(height, measuredWidth, onPress)}
              keyExtractor={({ buddyId }) => buddyId}
              horizontal={true}
              testID={'components.mentorList'}
            />
          </RN.View>
        )}
      </RemoteData>
    </RN.View>
  );
};

const mentorCardBottomMargin = 16;

const renderMentorCard =
  (
    maxHeight: number,
    screenWidth: number,
    onPress?: (mentor: mentorApi.Mentor) => void | undefined,
  ) =>
  ({ item }: { item: mentorApi.Mentor }) =>
    (
      <MentorCard
        style={[
          styles.card,
          {
            maxHeight: maxHeight - mentorCardBottomMargin,
            width: screenWidth * 0.85,
            marginRight: (0.15 / 4) * screenWidth,
          },
        ]}
        mentor={item}
        onPress={onPress}
      />
    );

const styles = RN.StyleSheet.create({
  mentorListContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    alignSelf: 'stretch',
  },
  carouselContainer: {
    flex: 1,
  },
  scrollContainer: { paddingHorizontal: 16 },
  card: {
    alignSelf: 'stretch',
    flexGrow: 1,
    marginBottom: mentorCardBottomMargin,
  },
});
