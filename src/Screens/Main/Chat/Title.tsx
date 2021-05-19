import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as state from '../../../state';
import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';

import useLayout from '../../../lib/use-layout';

import colors from '../../components/colors';
import { cardBorderRadius } from '../../components/Card';
import fonts from '../../components/fonts';
import getBuddyColor from '../../components/getBuddyColor';

import DropDown, { DropDownItem } from '../../components/DropDownMenu';
import { Dialog } from '../../components/Dialog';
import { MessageId } from '../../../localization';

type StateProps = {
  name: string;
};

type DispatchProps = {};

type OwnProps = {
  style?: RN.StyleProp<RN.ViewStyle>;
  onPress: () => void | undefined;
  buddyId: string;
};

type Props = OwnProps & DispatchProps & StateProps;

type DialogProperties = {
  textId: MessageId;
  buttonId: MessageId;
  onPress: () => void | undefined;
  type?: 'warning';
};

const Title: React.FC<Props> = ({ style, onPress, name, buddyId }) => {
  const [isDropdownOpen, setDropdownOpen] = React.useState(false);

  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const [{ height }, onLayout] = useLayout();

  const color = getBuddyColor(buddyId);

  const isBanned = ReactRedux.useSelector(selectors.getIsBanned(buddyId));

  const dispatch = ReactRedux.useDispatch<redux.Dispatch<actions.Action>>();

  const setBanStatus = (banStatus: 'Ban' | 'Unban') => {
    dispatch({
      type: 'buddies/changeBanStatus/start',
      payload: { buddyId, banStatus },
    });
  };

  const closeDropdownAndDialog = () => {
    setDropdownOpen(false);
    setDialogOpen(false);
  };

  const handleBan = (banStatus: 'Ban' | 'Unban') => {
    closeDropdownAndDialog();
    setBanStatus(banStatus);
    onPress();
  };

  const dialogProperties: DialogProperties = isBanned
    ? {
        textId: 'main.chat.unban.confirmation',
        buttonId: 'main.chat.unban',
        onPress: () => handleBan('Unban'),
      }
    : {
        textId: 'main.chat.ban.confirmation',
        buttonId: 'main.chat.ban',
        onPress: () => handleBan('Ban'),
        type: 'warning',
      };
  const dropdownItems: DropDownItem[] = [
    {
      textId: dialogProperties.buttonId,
      onPress: () => setDialogOpen(true),
    },
  ];
  return (
    <RN.View
      onLayout={onLayout}
      style={[styles.blob, { backgroundColor: color }, style]}
    >
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
        <RN.TouchableHighlight
          style={styles.kebab}
          onPress={() => setDropdownOpen(!isDropdownOpen)}
          underlayColor={colors.faintBackground}
        >
          <RN.Image
            source={require('../../images/three-dot-menu.svg')}
            style={{ tintColor: colors.black }}
          />
        </RN.TouchableHighlight>
        {isDropdownOpen ? (
          <DropDown
            style={[styles.dropdown, { top: height - 8 }]}
            closeDropdown={() => setDropdownOpen(false)}
            items={dropdownItems}
            testID={'main.chat.menu'}
            tintColor={colors.black}
          />
        ) : null}
        {isDialogOpen ? (
          <Dialog
            {...dialogProperties}
            onPressCancel={() => setDialogOpen(false)}
          />
        ) : null}
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
  kebab: {
    height: 40,
    width: 40,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  dropdown: {
    position: 'absolute',
    right: 16,
  },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.AppState
>(({ mentors, buddies }, { buddyId }) => {
  return {
    name: selectors.getBuddyName(buddyId, buddies, mentors),
  };
})(Title);
