import { DEFAULT_GRADIENTS } from '../configuration/constants';

export const gradients = {
  default: Object.assign({}, ...DEFAULT_GRADIENTS
    .map(gradient => ({ [gradient.id]: gradient }))
  ),
  fire: {
    id: 'fire',
    name: 'Fire',
    gradientStops: [{ pos: 0, color: 'yellow' }, { pos: 50, color: 'orange' }, { pos: 100, color: 'red' }],
  },

  ice: {
    id: 'ice',
    name: 'Ice',
    gradientStops: [{ pos: 0, color: 'white' }, { pos: 100, color: 'cyan' }],
  }
};
