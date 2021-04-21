import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as state from '../../../state';
import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';

import colors from '../../components/colors';
import { cardBorderRadius } from '../../components/Card';
import fonts from '../../components/fonts';
import getBuddyColor from '../../components/getBuddyColor';
import DropDown, { DropDownItem } from 'src/Screens/components/DropDownMenu';
import { Dialog } from 'src/Screens/components/Dialog';

type StateProps = {
  name: string;
};
type DispatchProps = {};
type OwnProps = {
  style?: RN.StyleProp<RN.ViewStyle>;
  onPress: () => void | undefined;
  buddyId: string;
  isBanned?: boolean;
};
type Props = OwnProps & DispatchProps & StateProps;

const Title: React.FC<Props> = ({ style, onPress, name, buddyId, isBanned }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const color = getBuddyColor(buddyId);

  const dispatch = ReactRedux.useDispatch<redux.Dispatch<actions.Action>>();
  const banBuddy = () => {
    dispatch({ type: 'buddies/ban/start', payload: { buddyId } });
  };
  const handleBan = () => {
    banBuddy()
    onPress()
  }
  const dropdownItems: DropDownItem[] = [
    { textId: 'main.chat.ban', onPress: () => setDialogOpen(true) },
  ];

  return (
    <RN.View style={[styles.blob, { backgroundColor: color }, style]}>
      <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
        {!onPress ? null : (
          <RN.TouchableOpacity style={styles.chevronButton} onPress={onPress}>
            <RN.Image
              source={require('../../images/chevron-left.svg')}
              style={styles.chevronIcon}
            />
          </RN.TouchableOpacity>
        )}
        <RN.Image
          source={require('../../images/user.svg')}
          style={styles.userIcon}
        />
        <RN.Text style={styles.name}>{name}</RN.Text>
        {isBanned ?? <DropDown items={dropdownItems} testID={'main.chat.menu'} tintColor={colors.black} />}
        {dialogOpen &&
        <Dialog textId={'main.chat.ban.confirmation'} buttonId={'main.chat.ban'} onPressCancel={() => setDialogOpen(false)} onPress={handleBan} type='warning'></Dialog>
        }
      </SafeAreaView>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  blob: {
    borderBottomRightRadius: cardBorderRadius,
    borderBottomLeftRadius: cardBorderRadius,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  safeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  chevronButton: {
    marginRight: 16,
    marginLeft: 0,
  },
  chevronIcon: {
    tintColor: colors.black,
    width: 48,
    height: 48,
  },
  userIcon: {
    tintColor: colors.black,
    width: 64,
    height: 64,
    marginRight: 16,
  },
  name: {
    ...fonts.titleBold,
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.AppState
>(({ mentors, buddies }, { buddyId }) => {
  return { name: selectors.getBuddyName(buddyId, buddies, mentors) };
})(Title);
