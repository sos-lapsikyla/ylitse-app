import colors from './colors';

export const toastProps = {
  danger: {
    backgroundColor: colors.pink,
    tintColor: colors.danger,
    icon: require('../images/error_icon.svg'),
  },
  success: {
    backgroundColor: colors.lighterGreen,
    tintColor: colors.iconGreen,
    icon: require('../images/success_icon.svg'),
  },
};
