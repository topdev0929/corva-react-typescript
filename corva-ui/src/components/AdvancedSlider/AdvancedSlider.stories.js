import { makeStyles } from '@material-ui/core';
import AdvancedSliderComponent from './AdvancedSlider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  horizontal: {
    width: '450px',
    marginLeft: '40px',
    display: 'flex',
    flexDirection: 'column',

    '& > div': {
      height: '40px',
      marginBottom: '40px',
      background: '#2C2C2C',
      boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
    },
  },
  vertical: {
    height: '300px',
    marginTop: '40px',
    marginLeft: '80px',
    display: 'flex',

    '& > div': {
      width: '40px',
      marginRight: '40px',
      background: '#2C2C2C',
      boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
    },
  },
});

export const AdvancedSlider = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.horizontal}>
        <div>
          <AdvancedSliderComponent
            orientation="horizontal"
            min={props.min}
            max={props.max}
            value={props.value}
            onChange={props.onChange}
          />
        </div>
        <div>
          <AdvancedSliderComponent
            orientation="horizontal"
            min={props.min}
            max={props.max}
            value={props.value}
            onChange={props.onChange}
            reversed
          />
        </div>
      </div>
      <div className={classes.vertical}>
        <div>
          <AdvancedSliderComponent
            orientation="vertical"
            min={props.min}
            max={props.max}
            value={props.value}
            onChange={props.onChange}
          />
        </div>
        <div>
          <AdvancedSliderComponent
            orientation="vertical"
            min={props.min}
            max={props.max}
            value={props.value}
            onChange={props.onChange}
            handlePosition="right"
          />
        </div>
      </div>
    </div>
  );
};

AdvancedSlider.storyName = 'AdvancedSlider';

AdvancedSlider.args = {
  min: 0,
  max: 1000,
  value: [200, 800],
  valueFormatter: Math.floor,
  orientation: 'horizontal',
  onChange: () => {},
  onStop: () => {},
};

export default {
  title: 'Components/RangeSlider/AdvancedSlider',
  component: AdvancedSliderComponent,
  parameters: {
    options: {
      showPanel: true,
    },
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/AdvancedSlider/AdvancedSlider.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=31925%3A122776',
  },
  argTypes: {
    min: {
      type: { required: true },
      description: 'The minimum allowed value of the slider. Should not be equal to max.',
    },
    max: {
      type: { required: true },
      description: 'The maximum allowed value of the slider. Should not be equal to min.',
    },
    value: {
      description: 'The value of the slider. Provide an array with two values.',
    },
    valueFormatter: {
      description: 'The formatter of the slider value.',
      defaultValue: Math.floor,
    },
    displayFormatter: {
      description: 'Handle label formatter. Is only supported for `editableHandles=false`',
      defaultValue: value => value,
    },
    orientation: {
      description: 'The component orientation.',
      defaultValue: 'horizontal',
    },
    reversed: {
      description: 'Enable reversed view.',
      defaultValue: false,
    },
    editableHandles: {
      description: 'Enable handles read-only option.',
      defaultValue: true,
    },
    handlePosition: {
      description:
        "Position of the slider's handle. It can be one of these values; left, right, top, bottom",
    },
    onChange: {
      description: "Callback function that is fired when the slider's value changed.",
      defaultValue: () => {},
    },
    onStop: {
      description: "Callback function that is fired after the slider's value changed.",
      defaultValue: () => {},
    },
  },
};
