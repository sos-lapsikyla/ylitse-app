import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import * as navigationProps from '../../lib/navigation-props';
import * as http from '../../lib/http';
import * as remoteData from '../../lib/remote-data';

import * as buddyApi from '../../api/buddies';

import * as state from '../../state';
import * as selectors from '../../state/selectors';
import * as actions from '../../state/actions';

import colors, { gradients } from '../components/colors';
import fonts from '../components/fonts';
import { textShadow } from '../components/shadow';
import Card from '../components/Card';
import Message from '../components/Message';
import RemoteData from '../components/RemoteData';
import TitledContainer from '../components/TitledContainer';

export type BuddyListRoute = {
  'Main/BuddyList': {};
};

const BuddyButton = ({
  buddy,
  style,
  ...viewProps
}: RN.ViewProps & { buddy: buddyApi.Buddy }) => {
  return (
    <Card style={[buddyButtonStyles.button, style]} {...viewProps}>
      <RN.TouchableOpacity style={buddyButtonStyles.content}>
        <RN.Text style={buddyButtonStyles.nameText}>{buddy.name}</RN.Text>
        <LinearGradient style={buddyButtonStyles.blob} colors={gradients.pink}>
          <RN.Image source={require('../images/balloon.svg')} />
        </LinearGradient>
      </RN.TouchableOpacity>
    </Card>
  );
};

const buddyButtonStyles = RN.StyleSheet.create({
  button: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    flexGrow: 1,
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  nameText: {
    ...fonts.titleBold,
    marginLeft: 32,
    flex: 1,
  },
  blob: {
    borderRadius: 32,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    minHeight: 80,
  },
});

type StateProps = {
  buddies: remoteData.RemoteData<buddyApi.Buddy[], http.Err>;
};
type DispatchProps = {
  pollBuddies: () => void | undefined;
};

type OwnProps = navigationProps.NavigationProps<BuddyListRoute, BuddyListRoute>;
type Props = StateProps & DispatchProps & OwnProps;

const BuddyList = ({ buddies, pollBuddies }: Props) => {
  return (
    <TitledContainer
      TitleComponent={
        <Message id="buddyList.title" style={styles.screenTitleText} />
      }
      gradient={gradients.pillBlue}
    >
      <RemoteData data={buddies} fetchData={pollBuddies}>
        {value => (
          <RN.ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {value.map(buddy => (
              <BuddyButton
                key={buddy.userId}
                style={styles.button}
                buddy={buddy}
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
      buddies: selectors.getBuddies(appState),
    };
  },
  (dispatch: redux.Dispatch<actions.Action>) => ({
    pollBuddies: () => {
      dispatch(
        actions.creators.startPolling(actions.creators.fetchBuddies(), 3000),
      );
    },
  }),
)(BuddyList);
