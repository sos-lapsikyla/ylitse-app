import React from 'react';
import RN from 'react-native';
import Menu, {MenuItem} from 'react-native-material-menu';

import * as localization from '../../localization';

import colors from './colors';
import Message from './Message';
import fonts from './fonts';


type Item = {
  text: localization.MessageId;
  action: () => void;
  id: string;
};

interface Props {
  items: Item[];
  testID?: string;
}

const DropDown: React.FC<Props> = ({ items }) => {
  const [menu, setMenu] = React.useState<Menu|null>(null);



  const setMenuRef = (ref: Menu) => {
    setMenu(ref);
  };

  const hideMenu = () => {
    menu?.hide();
  };

  const showMenu = () => {
    if (menu) {
      menu?.show();
  }
  };

  const icon = (
    <RN.TouchableOpacity onPress={showMenu} >
      <RN.Image
        source={require('../images/search.svg')}
        style={styles.icon}
      />
    </RN.TouchableOpacity>)

  const renderItems = () => {
    const res = []
    for (const i of items) {
      res.push(<MenuItem onPress={() => {hideMenu();i.action()}} style={styles.buttons} key={i.id}><Message id={i.text} style={styles.text}></Message></MenuItem>)
    }
    return res
  }

  return (
    <RN.View style={styles.button} >
      <Menu
          ref={setMenuRef}
          button={icon}
          style={styles.dropdown}
          
      >
          {renderItems()}
      </Menu>
      </RN.View>
  );
};

export default DropDown;

const borderRadius = 18;
const styles = RN.StyleSheet.create({
  dropdown: {
    position: 'absolute',
    zIndex: 10,
    right: 8,
    top: 64,
    width: '50%',
    paddingTop: 16,
    borderRadius,
    backgroundColor: colors.lightestGray
  },
  icon: {
    tintColor: colors.blueGray,
    height: 20,
    width: 20,
  },
  button: {
    position: 'absolute',
    right: 16,
    zIndex: 3,
  },
  buttons: {
    padding: 8,
  },
  text: {

    ...fonts.largeBold,
  }
});
