import { CustomGradient } from '~/types';

export const ALREADY_EXISTS_MESSAGE = 'This name is already used';
export const NAME_IS_MISSING_MESSAGE = 'Please enter the name';
export const GRADIENT_STOP_PRECISION_DIGITS = 5;
export const GRADIENT_NEW_NAME = 'My Gradient';
export const GRADIENT_MAX_NAME_LENGTH = 30;

export const TEMP_GRADIENT_ID = 'TEMP_GRADIENT_ID';

export const DEFAULT_GRADIENTS: CustomGradient[] = [
  {
    id: 'chromium',
    name: 'Chromium',
    gradientStops: [
      { color: '#F7F7F7', pos: 0 },
      { color: '#828282', pos: 100 },
    ],
  },
  {
    id: 'garden',
    name: 'Garden',
    gradientStops: [
      { color: '#5256BE', pos: 0 },
      { color: '#3CA3BD', pos: 25 },
      { color: '#18B756', pos: 50 },
      { color: '#DECF11', pos: 75 },
      { color: '#AF534C', pos: 100 },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    gradientStops: [
      { color: '#C05B5B', pos: 0 },
      { color: '#D6CA1D', pos: 50 },
      { color: '#14C23A', pos: 100 },
    ],
  },
  {
    id: 'amber',
    name: 'Amber',
    gradientStops: [
      { color: '#FFFBF4', pos: 0 },
      { color: '#C0A87D', pos: 25 },
      { color: '#E2A547', pos: 50 },
      { color: '#CA8846', pos: 75 },
      { color: '#6D4B48', pos: 100 },
    ],
  },
  {
    id: 'volcano',
    name: 'Volcano',
    gradientStops: [
      { color: '#807373', pos: 0 },
      { color: '#C56265', pos: 25 },
      { color: '#CA8846', pos: 50 },
      { color: '#CF9957', pos: 75 },
      { color: '#D7CD1F', pos: 100 },
    ],
  },
  {
    id: 'cave',
    name: 'Cave',
    gradientStops: [
      { color: '#FEFEF3', pos: 0 },
      { color: '#F5D09E', pos: 10 },
      { color: '#ED9F3B', pos: 30 },
      { color: '#B9421C', pos: 50 },
      { color: '#541106', pos: 75 },
      { color: '#050204', pos: 100 },
    ],
  },
];

const GARDEN_GRADIENT_INDEX = 1;

export const DEFAULT_GRADIENT_STOPS = DEFAULT_GRADIENTS[GARDEN_GRADIENT_INDEX].gradientStops;
