import React from 'react';
import RN from 'react-native';

import fonts from './fonts';
import colors from './colors';

export interface Props extends RN.TextInputProps {
  inputStyle?: RN.StyleProp<RN.ViewStyle>;
  isLoading: boolean;
}

const LoadingInputField = ({
  style,
  inputStyle,
  maxLength,
  multiline,
  numberOfLines,
  isLoading,
  ...textInputProps
}: Props) => {
  const spinState = React.useRef(new RN.Animated.Value(0)).current;

  const spin = () =>
    RN.Animated.loop(
      RN.Animated.timing(spinState, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
        easing: RN.Easing.linear,
      }),
    ).start();

  React.useEffect(spin, [isLoading]);

  return (
    <RN.View style={style}>
      <RN.View>
        {isLoading ? (
          <RN.View style={[inputStyle, styles.inputText]}>
            <RN.Animated.View
              style={[
                styles.spinner,
                {
                  transform: [
                    {
                      rotate: spinState.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            />
          </RN.View>
        ) : (
          <RN.TextInput
            style={[inputStyle, styles.inputText]}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={numberOfLines}
            editable={!isLoading}
            {...textInputProps}
          />
        )}
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  inputText: {
    ...fonts.regularBold,
    color: colors.darkestBlue,
    backgroundColor: colors.lightestGray,
    alignSelf: 'stretch',
    flex: 1,
    flexGrow: 1,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 48,
    borderRadius: 16,
    textAlignVertical: 'top',
  },
  spinner: {
    alignSelf: 'center',
    width: 23,
    height: 23,
    borderRadius: 13,
    backgroundColor: colors.lighterBlue,
    borderRightColor: colors.green,
    borderColor: colors.white,
    borderWidth: 4,
    zIndex: 1,
  },
});

export default LoadingInputField;
