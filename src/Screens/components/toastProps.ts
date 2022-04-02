import colors from './colors';

export const toastProps = {
  danger: {
    backgroundColor: colors.pink,
    tintColor: colors.danger,
    secondaryButtonBackground: colors.lightestGray,
    primaryButton: colors.red,
    icon: require('../images/error_icon.svg'),
  },
  success: {
    backgroundColor: colors.lighterGreen,
    tintColor: colors.iconGreen,
    secondaryButtonBackground: colors.lightestGray,
    primaryButton: colors.iconGreen,
    icon: require('../images/success_icon.svg'),
  },
};
