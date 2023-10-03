import colors from '../colors';

export const props = {
  danger: {
    backgroundColor: colors.pink,
    tintColor: colors.danger,
    icon: require('../../images/error_icon.svg'),
  },
  success: {
    backgroundColor: colors.lighterGreen,
    tintColor: colors.iconGreen,
    icon: require('../../images/success_icon.svg'),
  },
  info: {
    backgroundColor: colors.lighterBlue,
    tintColor: colors.iconBlue,
    icon: require('../../images/info_icon.svg'),
  },
  warning: {
    backgroundColor: colors.orangeLight,
    tintColor: colors.purple,
    icon: require('../../images/alert_icon.svg'),
  },
};
