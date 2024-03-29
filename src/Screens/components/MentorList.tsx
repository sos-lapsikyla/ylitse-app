import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useSelector, useDispatch } from 'react-redux';

import * as mentorApi from '../../api/mentors';
import * as actions from '../../state/actions';
import * as tokenState from '../../state/reducers/accessToken';
import * as mentorsState from '../../state/reducers/mentors';

import useLayout from '../../lib/use-layout';

import MentorCard from './MentorCard';
import RemoteData from './RemoteData';
import { MentorTitleSpecial } from './MentorTitleSpecial';

type Props = {
  onPress?: (mentor: mentorApi.Mentor) => void | undefined;
  testID?: string;
};

const PADDING = 0.15;
const CARD_WIDTH = 0.85;

export default ({ onPress, testID }: Props) => {
  const userId = useSelector(tokenState.getUserId);
  const mentorList = useSelector(mentorsState.selectMentorList);

  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const fetchMentors = () => {
    dispatch({ type: 'mentors/start', payload: undefined });
  };

  const [{ width, height }, onLayout] = useLayout();
  const measuredWidth = width || RN.Dimensions.get('window').width;

  const interval = measuredWidth * (CARD_WIDTH + PADDING / (4 - PADDING));

  return (
    <RN.View
      onLayout={onLayout}
      style={styles.mentorListContainer}
      testID={testID}
    >
      <RemoteData data={mentorList} fetchData={fetchMentors}>
        {mentors => (
          <RN.FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            initialNumToRender={2}
            decelerationRate={'fast'}
            snapToInterval={interval}
            contentContainerStyle={{
              paddingLeft: (PADDING / 2) * measuredWidth,
            }}
            data={mentorApi.sort(userId, mentors)}
            renderItem={renderMentorCard(height, measuredWidth, onPress)}
            keyExtractor={({ buddyId }) => buddyId}
            horizontal={true}
            testID={'components.mentorList'}
          />
        )}
      </RemoteData>
    </RN.View>
  );
};

const mentorCardBottomMargin = 32;

const renderMentorCard =
  (
    maxHeight: number,
    screenWidth: number,
    onPress?: (mentor: mentorApi.Mentor) => void | undefined,
  ) =>
  ({ item }: { item: mentorApi.Mentor }) =>
    (
      <RN.View style={styles.hiddenContainer}>
        <MentorTitleSpecial mentor={item} />
        <MentorCard
          style={[
            styles.card,
            {
              maxHeight: maxHeight - mentorCardBottomMargin,
              width: screenWidth * CARD_WIDTH,
              marginRight: (PADDING / 4) * screenWidth,
            },
          ]}
          mentor={item}
          onPress={onPress}
        />
      </RN.View>
    );

const styles = RN.StyleSheet.create({
  mentorListContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    alignSelf: 'stretch',
  },
  scrollContainer: { paddingHorizontal: 16 },
  card: {
    alignSelf: 'stretch',
    flexGrow: 1,
    marginBottom: mentorCardBottomMargin,
  },
  hiddenContainer: {
    paddingTop: 8,
    overflow: 'hidden',
  },
});
