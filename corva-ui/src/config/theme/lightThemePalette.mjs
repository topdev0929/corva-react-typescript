import merge from 'lodash/merge.js';
import palette from './palette.mjs';

const lightThemePalette = merge({}, palette, {
  primary: {
    text1: '#000',
    text6: '#393939',
    text7: '#575757',
    text8: '#757575',
    text9: '#9e9e9e',
  },
  background: {
    b1: '#fff',
    b2: '#fff',
    b3: '#fff',
    b4: '#fff',
    b5: '#f5f5f5',
    b6: '#eeeeee',
    b7: '#e7e7e7',
    b8: '#e0e0e0',
    b9: '#d6d6d6',
    b10: '#c7c7c7',
    b11: '#bdbdbd',
  },
});

export default lightThemePalette;
