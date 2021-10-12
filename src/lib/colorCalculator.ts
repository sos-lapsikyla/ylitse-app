const HEX_COLOR = /^#([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})$/i;

const parseToNum = (colorHex: string): RGB => {
  if (!HEX_COLOR.test(colorHex)) {
    return [0, 0, 0];
  }

  const r = parseInt(colorHex.substring(1, 3), 16);
  const g = parseInt(colorHex.substring(3, 5), 16);
  const b = parseInt(colorHex.substring(5, 7), 16);

  return [r, g, b];
};

type RGB = [number, number, number];

const calculateAverage = (rgb1: RGB, rgb2: RGB): RGB => [
  Math.ceil((rgb1[0] + rgb2[0]) / 2),
  Math.ceil((rgb1[1] + rgb2[1]) / 2),
  Math.ceil((rgb1[2] + rgb2[2]) / 2),
];

const toHex = (rgb: number) => {
  const hex = rgb.toString(16);

  if (hex.length < 2) {
    return `0${hex}`;
  }

  return hex;
};

const parseToHex = (rgb: RGB): string => {
  const r = toHex(rgb[0]);
  const g = toHex(rgb[1]);
  const b = toHex(rgb[2]);

  return `#${r}${g}${b}`;
};

export const createMiddleColorAsHex = (hex: [string, string]) => {
  const rgb1 = parseToNum(hex[0]);
  const rgb2 = parseToNum(hex[1]);
  const averageRgb = calculateAverage(rgb1, rgb2);
  const averageHex = parseToHex(averageRgb);

  if (!HEX_COLOR.test(averageHex)) {
    return '#000000';
  }

  return averageHex;
};
