import colors from './colors';

const mapping: Record<number, string> = {
  0: colors.orange,
  1: colors.green,
  2: colors.red,
};

export default (str: string) => {
  const num = Math.floor(
    str.charCodeAt(0) * str.charCodeAt(1) + str.charCodeAt(2) / 11,
  );

  return mapping[num % 3];
};
