import colors from '../colors';

export const props = {
  danger: {
    backgroundColor: colors.pink,
    tintColor: colors.danger,
    secondaryButton: colors.lightestGray,
    primaryButton: colors.red,
    icon: require('../../images/error_icon.svg'),
  },
  success: {
    backgroundColor: colors.lighterGreen,
    tintColor: colors.iconGreen,
    secondaryButton: colors.lightestGray,
    primaryButton: colors.iconGreen,
    icon: require('../../images/success_icon.svg'),
  },
  info: {
    backgroundColor: colors.lighterBlue,
    tintColor: colors.iconBlue,
    secondaryButton: colors.lightestGray,
    primaryButton: colors.lightBlue,
    icon: require('../../images/info_icon.svg'),
  },
  warning: {
    backgroundColor: colors.lighterYellow,
    tintColor: colors.iconYellow,
    secondaryButton: colors.lightestGray,
    primaryButton: colors.lightYellow,
    icon: require('../../images/alert_icon.svg'),
  },
};
