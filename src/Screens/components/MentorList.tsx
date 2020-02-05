import React from 'react';
import RN from 'react-native';
import * as snapCarousel from 'react-native-snap-carousel';

import useLayout from '../../lib/use-layout';

import MentorCard from '../components/MentorCard';
import RemoteData from '../components/RemoteData';

import * as mentorApi from '../../api/mentors';
import * as state from '../../state';

type Props = {
  fetchMentors: () => void | undefined;
  mentors: state.AppState['mentors'];
  onPress?: (mentor: mentorApi.Mentor) => void | undefined;
};

const MentorList = ({ fetchMentors, mentors, onPress }: Props) => {
  const [{ width, height }, onLayout] = useLayout();
  const measuredWidth = width || RN.Dimensions.get('window').width;
  return (
    <RN.View onLayout={onLayout} style={styles.mentorListContainer}>
      <RemoteData data={mentors} fetchData={fetchMentors}>
        {value => (
          <RN.View style={styles.carouselContainer}>
            <snapCarousel.default
              data={[...value.values()]}
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

export default MentorList;
