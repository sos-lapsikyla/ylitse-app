import colors from '../colors';

export const props = {
  danger: {
    backgroundColor: colors.red,
    icon: require('../../images/error_icon.svg'),
  },
  success: {
    backgroundColor: colors.greenLight,
    icon: require('../../images/success_icon.svg'),
  },
  info: {
    backgroundColor: colors.blue,
    icon: require('../../images/info_icon.svg'),
  },
  warning: {
    backgroundColor: colors.orangeLighter,
    icon: require('../../images/alert_icon.svg'),
  },
};
