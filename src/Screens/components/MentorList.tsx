import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';

import useLayout from '../../lib/use-layout';

import MentorCard from '../components/MentorCard';
import RemoteData from '../components/RemoteData';

import * as mentorApi from '../../api/mentors';

import * as mentorState from '../../state/reducers/mentors';
import * as tokenState from '../../state/reducers/accessToken';

import * as actions from '../../state/actions';

type Props = {
  onPress?: (mentor: mentorApi.Mentor) => void | undefined;
};

export default ({ onPress }: Props) => {
  const userId = useSelector(tokenState.getUserId);

  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  const fetchMentors = () => {
    dispatch({ type: 'mentors/start', payload: undefined });
  };

  const mentorList = RD.remoteData.map(useSelector(mentorState.get), mentors =>
    mentors.filter(mentor => mentor.buddyId !== userId),
  );

  const [{ width, height }, onLayout] = useLayout();
  const measuredWidth = width || RN.Dimensions.get('window').width;

  const interval = measuredWidth * (0.85 + 0.15 / 4);

  const deccelerationRate = RN.Platform.OS === 'ios' ? 0.99 : 0.8;

  return (
    <RN.View onLayout={onLayout} style={styles.mentorListContainer}>
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

const renderMentorCard = (
  maxHeight: number,
  screenWidth: number,
  onPress?: (mentor: mentorApi.Mentor) => void | undefined,
) => ({ item }: { item: mentorApi.Mentor }) => (
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
