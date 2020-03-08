import React from 'react';
import RN from 'react-native';
import * as snapCarousel from 'react-native-snap-carousel';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';

import * as err from '../../lib/http-err';
import useLayout from '../../lib/use-layout';

import MentorCard from '../components/MentorCard';
import RemoteData from '../components/RemoteData';

import * as mentorApi from '../../api/mentors';
import * as state from '../../state';
import * as actions from '../../state/actions';
import * as selectors from '../../state/selectors';

type StateProps = {
  mentorsState: RD.RemoteData<err.Err, mentorApi.Mentor[]>;
};
type DispatchProps = {
  fetchMentors: () => void | undefined;
};

type OwnProps = {
  onPress?: (mentor: mentorApi.Mentor) => void | undefined;
};

type Props = StateProps & DispatchProps & OwnProps;

const MentorList = ({ fetchMentors, mentorsState, onPress }: Props) => {
  const [{ width, height }, onLayout] = useLayout();
  const measuredWidth = width || RN.Dimensions.get('window').width;
  return (
    <RN.View onLayout={onLayout} style={styles.mentorListContainer}>
      <RemoteData data={mentorsState} fetchData={fetchMentors}>
        {mentors => (
          <RN.View style={styles.carouselContainer}>
            <snapCarousel.default
              data={mentors}
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

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.AppState
>(
  ({ mentors }) => ({ mentorsState: selectors.getMentors(mentors) }),
  (dispatch: redux.Dispatch<actions.Action>) => ({
    fetchMentors: () => {
      dispatch({ type: 'mentors/start', payload: undefined });
    },
  }),
)(MentorList);
