import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as snapCarousel from 'react-native-snap-carousel';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';
import * as remoteData from '../../lib/remote-data';
import useLayout from '../../lib/use-layout';
import * as api from '../../api/mentors';
import * as state from '../../state';

import Background from '../components/Background';
import MentorCard from '../components/MentorCard';
import colors from '../components/colors';
import fonts from '../components/fonts';
import { textShadow } from '../components/shadow';
import RemoteData from '../components/RemoteData';
import Button from '../components/Button';
import Message from '../components/Message';
import CreatedBySosBanner from '../components/CreatedBySosBanner';

import { SignUpRoute } from './SignUp';

export type MentorListRoute = {
  'Onboarding/MentorList': {};
};

type StateProps = {
  mentors: remoteData.RemoteData<Map<string, api.Mentor>>;
};
type DispatchProps = {
  fetchMentors: () => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<MentorListRoute, SignUpRoute>;
type Props = StateProps & DispatchProps & OwnProps;

const MentorList = (props: Props) => {
  const [{ width, height }, onLayout] = useLayout();
  const measuredWidth = width || RN.Dimensions.get('window').width;

  const navigateNext = () => {
    props.navigation.navigate('Onboarding/SignUp', {});
  };
  return (
    <Background>
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: 'always', bottom: 'always' }}
      >
        <Message style={styles.title1} id="onboarding.mentorlist.upperTitle" />
        <Message style={styles.title2} id="onboarding.mentorlist.lowerTitle" />
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
        <RN.View style={styles.bottom}>
          <Button
            style={styles.button}
            onPress={navigateNext}
            messageStyle={styles.buttonMessage}
            messageId="onboarding.mentorlist.start"
            badge={require('../images/arrow.svg')}
          />
          <CreatedBySosBanner style={styles.banner} />
        </RN.View>
      </SafeAreaView>
    </Background>
  );
};

const mentorCardBottomMargin = 16;

const renderMentorCard = (maxHeight: number) => ({
  item,
}: {
  item: api.Mentor;
}) => (
  <MentorCard
    style={[styles.card, { maxHeight: maxHeight - mentorCardBottomMargin }]}
    mentor={item}
  />
);

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title1: {
    ...fonts.title,
    ...textShadow,
    color: colors.white,
  },
  title2: {
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
  banner: {
    marginTop: 16,
    marginBottom: 8,
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
      dispatch(state.actions.fetchMentors());
    },
  }),
)(MentorList);
