// TODO Improve naming

const colors = {
  haze: '#F4F8FC',
  white: '#FFFFFF',
  gray: '#8F9EAC',
  faintGray: '#EBF2F8',
  darkBlue: '#5AD5FC',
  lightBlue: '#639DEE',
  lightOrange: '#FFBE73',
  darkOrange: '#FFD9A2',
  lightPink: '#FDB8D1',
  darkPink: '#FFDFF5',

  lightTeal: '#75C9C3',
  darkTeal: '#51F5DB',
  black: '#000',

  deepBlue: '#003363',
  faintBlue: '#5A7C9B',

  acidGreen1: '#5BD858',
  acidGreen2: '#46E769',
  danger: '#E93C66',
};

export const gradients = {
  pillBlue: [colors.lightBlue, '#78B8F4'],
  teal: [colors.darkTeal, colors.lightTeal],
  orange: [colors.darkOrange, colors.lightOrange],
  pink: [colors.darkPink, colors.lightPink],
  acidGreen: [colors.acidGreen1, colors.acidGreen2],
  faintGray: [colors.faintGray, colors.faintGray],
  whitegray: [colors.faintGray, colors.white],
};

export default colors;
