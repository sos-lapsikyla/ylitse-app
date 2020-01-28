import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

import * as navigationProps from '../../lib/navigation-props';

import * as authApi from '../../api/auth';
import * as buddyApi from '../../api/buddies';
import * as state from '../../state';

import colors, { gradients } from '../components/colors';
import fonts from '../components/fonts';
import shadow, { textShadow } from '../components/shadow';
import Card from '../components/Card';
import Message from '../components/Message';
import RemoteData from '../components/RemoteData';

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
  accessToken: authApi.AccessToken;
  buddies: state.State['buddies'];
};
type DispatchProps = {
  fetchBuddies: (token: authApi.AccessToken) => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<BuddyListRoute, BuddyListRoute>;
type Props = StateProps & DispatchProps & OwnProps;

const BuddyList = ({ buddies, accessToken, fetchBuddies }: Props) => {
  return (
    <LinearGradient style={styles.background} colors={gradients.whitegray}>
      <RN.View style={styles.shadow}>
        <LinearGradient style={styles.blob} colors={gradients.pillBlue}>
          <SafeAreaView forceInset={{ top: 'always' }}>
            <Message id="buddyList.title" style={styles.screenTitleText} />
          </SafeAreaView>
        </LinearGradient>
      </RN.View>
      <RemoteData data={buddies} fetchData={() => fetchBuddies(accessToken)}>
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
    </LinearGradient>
  );
};

const styles = RN.StyleSheet.create({
  background: {
    flex: 1,
  },
  shadow: {
    ...shadow(7),
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 2,
  },
  blob: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  state.State
>(
  ({ accessToken, buddies }) => {
    // TODO  SEPARATE APP TO DIFFERENT PHASES
    if (accessToken.type !== 'Success') {
      throw Error('bad state');
    }
    return {
      accessToken: accessToken.value,
      buddies,
    };
  },
  (dispatch: redux.Dispatch<state.Action>) => ({
    fetchBuddies: (accessToken: authApi.AccessToken) => {
      dispatch(state.actions.fetchBuddies([accessToken]));
    },
  }),
)(BuddyList);
