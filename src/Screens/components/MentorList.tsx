import React from 'react';
import RN from 'react-native';
import * as snapCarousel from 'react-native-snap-carousel';
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
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  const fetchMentors = () => {
    dispatch({ type: 'mentors/start', payload: undefined });
  };

  const userId = useSelector(tokenState.getUserId);
  const mentorList = RD.remoteData.map(useSelector(mentorState.get), mentors =>
    mentors.filter(mentor => mentor.buddyId !== userId),
  );

  const [{ width, height }, onLayout] = useLayout();
  const measuredWidth = width || RN.Dimensions.get('window').width;
  return (
    <RN.View onLayout={onLayout} style={styles.mentorListContainer}>
      <RemoteData data={mentorList} fetchData={fetchMentors}>
        {mentors => (
          <RN.View style={styles.carouselContainer}>
            <snapCarousel.default
              data={[...mentors].sort(mentorApi.compare(userId))}
              renderItem={renderMentorCard(height, onPress)}
              sliderWidth={measuredWidth}
              itemWidth={measuredWidth * 0.9}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
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
  onPress?: (mentor: mentorApi.Mentor) => void | undefined,
) => ({ item }: { item: mentorApi.Mentor }) => (
  <MentorCard
    style={[styles.card, { maxHeight: maxHeight - mentorCardBottomMargin }]}
    mentor={item}
    onPress={onPress}
  />
);

const styles = RN.StyleSheet.create({
  mentorListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'stretch',
  },
  carouselContainer: {
    flex: 1,
  },
  card: {
    alignSelf: 'stretch',
    marginHorizontal: 8,
    flexGrow: 1,
    marginBottom: mentorCardBottomMargin,
  },
});
