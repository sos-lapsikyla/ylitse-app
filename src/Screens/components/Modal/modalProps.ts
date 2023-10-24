import colors from '../colors';

export const props = {
  danger: {
    backgroundColor: colors.lightDanger,
    tintColor: colors.danger,
    icon: require('../../images/error_icon.svg'),
  },
  success: {
    backgroundColor: colors.lighterGreen,
    tintColor: colors.green,
    icon: require('../../images/success_icon.svg'),
  },
  info: {
    backgroundColor: colors.lightBlue,
    tintColor: colors.darkestBlue,
    icon: require('../../images/info_icon.svg'),
  },
  warning: {
    backgroundColor: colors.orangeLight,
    tintColor: colors.purple,
    icon: require('../../images/alert_icon.svg'),
  },
};
