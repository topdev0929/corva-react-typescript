import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { GradientPicker } from './GradientPicker';

const defaultStops = [
  { color: '#5256BE', pos: 0 },
  { color: '#3CA3BD', pos: 25 },
  { color: '#18B756', pos: 50 },
  { color: '#DECF11', pos: 75 },
  { color: '#AF534C', pos: 100 },
]

export const Default = props => {
  const [stops, setStops] = useState(defaultStops);
  const handleChange = (newStops) => {
    setStops(newStops);
    action('onChange')(newStops);
  }
  return (
    <div style={{ maxWidth: '600px' }}>
      <GradientPicker
        {...props}
        gradientStops={stops}
        onChange={handleChange}
      />
    </div>
  );
};

export default {
  title: 'Components/GradientPicker',
  component: GradientPicker,
  argTypes: {
    from: {
      value: 0,
      options: [0, -200],
      control: { type: 'radio' },
    },
    to: {
      value: 100,
      options: [0.01, 1, 50, 250, 100_000_000],
      control: { type: 'radio' },
    },
    isMoveInputVisible: {
      value: true,
      options: [true, false],
      control: { type: 'boolean' },
    }
  },
  parameters: {
    sourceLink: 'https://github.com/corva-ai/corva-ui/blob/feat/develop/src/components/GradientPicker/GradientPicker.tsx',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System',
  },
};
