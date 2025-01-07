/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import RangeSliderComponent from '~/components/RangeSlider';

export const RangeSlider = props => {
  const [{ fromHorizontal, toHorizontal }, setRangeHorizontal] = useState({
    fromHorizontal: props.from,
    toHorizontal: props.to,
  });
  const [{ fromVertical, toVertical }, setRangeVertical] = useState({
    fromVertical: props.from,
    toVertical: props.to,
  });

  useEffect(() => {
    setRangeHorizontal({
      fromHorizontal: props.from,
      toHorizontal: props.to,
    });
    setRangeVertical({
      fromVertical: props.from,
      toVertical: props.to,
    });
  }, [props.from, props.to]);

  const handleChangeHorizontal = ({ from, to }) => {
    return setRangeHorizontal({ fromHorizontal: from, toHorizontal: to });
  };

  const handleChangeVertical = ({ from, to }) => {
    return setRangeVertical({ fromVertical: from, toVertical: to });
  };

  return (
    <>
      <div style={{ padding: 40 }}>
        <RangeSliderComponent
          from={fromHorizontal}
          to={toHorizontal}
          max={props.max}
          onChange={handleChangeHorizontal}
          orientation="horizontal"
          disabled={props.disabled}
          minRange={props.minRange}
          precision={props.precision}
          isSingleRange={props.isSingleRange}
          isWithoutInput={props.isWithoutInput}
        />
      </div>
      <div style={{ padding: 40, height: 300 }}>
        <RangeSliderComponent
          from={fromVertical}
          to={toVertical}
          max={props.max}
          onChange={handleChangeVertical}
          orientation="vertical"
          minRange={props.minRange}
          disabled={props.disabled}
          precision={props.precision}
          isSingleRange={props.isSingleRange}
          isWithoutInput={props.isWithoutInput}
        />
      </div>
    </>
  );
};

RangeSlider.storyName = 'RangeSlider';

export default {
  title: 'Components/RangeSlider',
  component: RangeSliderComponent,
  parameters: {
    options: {
      showPanel: true,
    },
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/RangeSlider/RangeSlider.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=29803%3A120865',
  },
  argTypes: {
    from: {
      description: 'Value of the left pin.',
    },
    to: {
      description: 'Value of the right pin.',
    },
    min: {
      description: 'Minimum available value.',
    },
    max: {
      description: 'Maximum available value.',
    },
    minRange: {
      description: 'Minimum available range between FROM and TO values.',
    },
    orientation: {
      description: 'Type of orientation.',
    },
    precision: {
      description: 'Precision value after decimal point.',
    },
    onChange: {
      description:
        'Callback function called every time FROM or TO values are changed. (Bound to mousemove event)',
    },
    disabled: {
      control: 'boolean',
    },
    isSingleRange: {
      control: 'boolean',
    },
    isWithoutInput: {
      control: 'boolean',
    },
  },
  args: {
    from: 10,
    to: 10000,
    min: 0,
    max: 120000,
    minRange: 10000,
    disabled: false,
    isSingleRange: false,
    isWithoutInput: false,
  },
};
