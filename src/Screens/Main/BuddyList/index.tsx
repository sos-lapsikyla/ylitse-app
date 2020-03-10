import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';

import * as navigationProps from '../../../lib/navigation-props';
import * as err from '../../../lib/http-err';

import * as buddyApi from '../../../api/buddies';

import * as state from '../../../state';
import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';

import colors, { gradients } from '../../components/colors';
import fonts from '../../components/fonts';
import { textShadow } from '../../components/shadow';
import Message from '../../components/Message';
import RemoteData from '../../components/RemoteData';
import TitledContainer from '../../components/TitledContainer';

import Button from './Button';

import { ChatRoute } from '../Chat';

export type BuddyListRoute = {
  'Main/BuddyList': {};
};

type StateProps = {
  chatList: RD.RemoteData<err.Err, buddyApi.Buddy[]>;
};
type DispatchProps = {
  pollMessages: () => void | undefined;
};

type OwnProps = navigationProps.NavigationProps<BuddyListRoute, ChatRoute>;
type Props = StateProps & DispatchProps & OwnProps;

const BuddyList = ({ navigation, chatList, pollMessages }: Props) => {
  const onPress = (buddyId: string) => {
    navigation.navigate('Main/Chat', { buddyId });
  };
  return (
    <TitledContainer
      TitleComponent={
        <Message id="buddyList.title" style={styles.screenTitleText} />
      }
      gradient={gradients.pillBlue}
    >
      <RemoteData data={chatList} fetchData={pollMessages}>
        {value => (
          <RN.ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {value.map(thread => (
              <Button
                key={thread.buddyId}
                style={styles.button}
                onPress={onPress}
                name={thread.name}
                buddyId={thread.buddyId}
              />
            ))}
          </RN.ScrollView>
        )}
      </RemoteData>
    </TitledContainer>
  );
};

const styles = RN.StyleSheet.create({
  screenTitleText: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.specialTitle,
    ...textShadow,
    textAlign: 'center',
    color: colors.white,
  },
  scrollView: {
    zIndex: 1,
    marginTop: -32,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  button: { marginVertical: 16 },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.AppState
>(
  appState => {
    return {
      chatList: selectors.getChatList(appState.buddies),
    };
  },
  (dispatch: redux.Dispatch<actions.Action>) => ({
    pollMessages: () => {
      dispatch({ type: 'messages/start', payload: undefined });
    },
  }),
)(BuddyList);
