import React from 'react';
import { Keyboard } from 'react-native';

export const useIsKeyboardShown = () => {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const ShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });

    const HideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });

    return () => {
      HideListener.remove();
      ShowListener.remove();
    };
  }, []);

  return isKeyboardVisible;
};
