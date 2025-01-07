/* eslint-disable jsx-a11y/label-has-associated-control */
import { Typography, TextField, Box } from '@material-ui/core';
import { SCALE_TYPE, SCALE_PROPS } from '@/constants';
import { useStyles } from './styles';

interface ScaleProps {
    label: string;
    scale: number[];
    setScale: (value: number[]) => void;
    disabled?: boolean,
    type: SCALE_PROPS;
}

export const Scale = ({ label, scale, setScale, disabled = false, type }: ScaleProps) => {
  const classes = useStyles();

    return (
      <Box>
        <Typography variant="body1" className={classes.label}>{label}</Typography>
        <Box className={classes.wrapper}>
          <TextField
            id="min-value-input"
            type="number"
            label={<label htmlFor="min-value-input">Min Value</label>}
            // eslint-disable-next-line no-nested-ternary
            value={type === SCALE_TYPE.LOW ? scale[0] : (type === SCALE_TYPE.MEDIUM ? scale[1] : scale[2])}
            disabled={disabled}
            onChange={(e) => {
              setScale(scale.map((s, i) => {
                const value = parseFloat(e.target.value);
                if (i === 0 && type === SCALE_TYPE.LOW && value <= scale[1]) {
                  return parseFloat(e.target.value);
                }
                if (i === 1 && type === SCALE_TYPE.MEDIUM && value <= scale[2] && value >= scale[0]) {
                  return parseFloat(e.target.value);
                }
                if (i === 2 && type === SCALE_TYPE.HIGH && value <= scale[3] && value >= scale[1]) {
                  return parseFloat(e.target.value);
                }
                return s;
              }))
            }}
          />
          <TextField
            id="max-value-input"
            type="number"
            label={<label htmlFor="max-value-input">Max Value</label>}
            // eslint-disable-next-line no-nested-ternary
            value={type === SCALE_TYPE.LOW ? scale[1] : (type === SCALE_TYPE.MEDIUM ? scale[2] : scale[3])}
            disabled={disabled}
            onChange={(e) => {
              setScale(scale.map((s, i) => {
                const value = parseFloat(e.target.value);
                if (i === 1 && type === SCALE_TYPE.LOW && value >= scale[0] && value <= scale[2]) {
                  return value;
                }
                if (i === 2 && type === SCALE_TYPE.MEDIUM && value >= scale[1] && value <= scale[3]) {
                  return value;
                }
                if (i === 3 && type === SCALE_TYPE.HIGH && value >= scale[2]) {
                  return value;
                }
                return s;
              }))
            }}
          />
        </Box>
      </Box>
    );
}
