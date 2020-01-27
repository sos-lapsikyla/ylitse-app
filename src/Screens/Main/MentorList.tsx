import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as snapCarousel from 'react-native-snap-carousel';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import * as mentorApi from '../../api/mentors';
import * as remoteData from '../../lib/remote-data';
import useLayout from '../../lib/use-layout';
import * as state from '../../state';

import Background from '../components/Background';
import MentorCard from '../components/MentorCard';
import { textShadow } from '../components/shadow';
import RemoteData from '../components/RemoteData';
import Message from '../components/Message';
import colors from '../components/colors';
import fonts from '../components/fonts';

export type MentorListRoute = {
  'Main/MentorList': {};
};

type StateProps = {
  mentors: remoteData.RemoteData<Map<string, mentorApi.Mentor>>;
};
type DispatchProps = {
  fetchMentors: () => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<
  MentorListRoute,
  MentorListRoute
>;
type Props = StateProps & DispatchProps & OwnProps;

const MentorList = (props: Props) => {
  const [{ width, height }, onLayout] = useLayout();
  const measuredWidth = width || RN.Dimensions.get('window').width;
  return (
    <Background>
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: 'always', bottom: 'always' }}
      >
        <Message style={styles.title} id="main.mentorList.title" />
        <RN.View onLayout={onLayout} style={styles.mentorListContainer}>
          <RemoteData data={props.mentors} fetchData={props.fetchMentors}>
            {value => (
              <RN.View style={styles.carouselContainer}>
                <snapCarousel.default
                  data={[...value.values()]}
                  renderItem={renderMentorCard(height)}
                  sliderWidth={measuredWidth}
                  itemWidth={measuredWidth * 0.9}
                  inactiveSlideOpacity={1}
                  inactiveSlideScale={1}
                />
              </RN.View>
            )}
          </RemoteData>
        </RN.View>
        <RN.View style={styles.bottomSeparator} />
      </SafeAreaView>
    </Background>
  );
};

const mentorCardBottomMargin = 16;

const renderMentorCard = (maxHeight: number) => ({
  item,
}: {
  item: mentorApi.Mentor;
}) => (
  <MentorCard
    style={[styles.card, { maxHeight: maxHeight - mentorCardBottomMargin }]}
    mentor={item}
    onPress={() => {}}
  />
);

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: 24,
    marginBottom: 8,
    ...fonts.specialTitle,
    ...textShadow,
    color: colors.white,
  },
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
  bottom: {
    marginTop: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  button: { marginHorizontal: 24, alignSelf: 'stretch' },
  buttonMessage: {
    textAlign: 'center',
    color: colors.deepBlue,
    ...fonts.titleBold,
    marginRight: 16,
  },
  bottomSeparator: {
    height: 96,
  },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.State
>(
  ({ mentors }) => ({ mentors }),

  (dispatch: redux.Dispatch<state.Action>) => ({
    fetchMentors: () => {
      dispatch(state.actions.fetchMentors([]));
    },
  }),
)(MentorList);
