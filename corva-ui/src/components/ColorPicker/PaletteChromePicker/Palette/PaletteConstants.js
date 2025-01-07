export const paletteColors = [
  // row 1
  '#c4c4c4',
  '#9b2310',
  '#ac5d09',
  '#a99704',
  '#6f920d',
  '#408e00',
  '#05907b',
  '#028597',
  '#295abb',
  '#4d2fbf',
  '#8a1caa',
  '#921d48',
  '#445f6c',
  // row 2
  '#000000',
  '#eb3f24',
  '#ff8200',
  '#ffe300',
  '#b9ed24',
  '#7eed24',
  '#1edcc1',
  '#00e0ff',
  '#558dfc',
  '#714cff',
  '#cc2afb',
  '#f6377c',
  '#738e9d',
  // row 3
  '#ffffff',
  '#fe8977',
  '#fbb368',
  '#fff17f',
  '#d6ff61',
  '#b9ff81',
  '#78feea',
  '#79efff',
  '#97baff',
  '#ad99fb',
  '#e488ff',
  '#ff87b3',
  '#bbc6cc',
];

export const TRANSPARENT_HEX = '#00000000';

export const paletteColorsWithTransparent = paletteColors.map((color, i) => {
  return i === 0 ? TRANSPARENT_HEX : color;
});
