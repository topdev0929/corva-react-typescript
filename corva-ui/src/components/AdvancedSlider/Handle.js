/* eslint-disable no-use-before-define */
import { useState, useEffect, useRef } from 'react';
import { makeStyles, Input } from '@material-ui/core';
import classnames from 'classnames';
import { debounce } from 'lodash';

const debouncedFunc = debounce(callback => {
  callback();
}, 500);

/*
interface HandleProps {
  value: number | string;
  orientation: 'vertical' | 'horizontal';
  placement: 'head' | 'tail';
  onChange: (newValue: number) => void;
  min: number;
  max: number;
}
*/
export const Handle = ({
  value,
  orientation,
  placement,
  readOnly,
  onChange,
  min,
  max,
  displayFormatter,
  classes,
}) => {
  const styles = useStyles();
  const [internal, setInternal] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  const onChangeValue = e => {
    const newValue = e.target.value;
    setInternal(newValue);

    if (Number.isFinite(+newValue) && +newValue >= min && +newValue <= max) {
      debouncedFunc(() => {
        onChange(+newValue);
      });
    }
  };

  return (
    <div
      className={classnames(styles.root, classes.handleRoot, {
        [styles.horizontalHeadRoot]: orientation === 'horizontal' && placement === 'head',
        [styles.horizontalTailRoot]: orientation === 'horizontal' && placement === 'tail',
        [styles.verticalHeadRoot]: orientation === 'vertical' && placement === 'head',
        [styles.verticalTailRoot]: orientation === 'vertical' && placement === 'tail',
      })}
    >
      <div
        className={classnames(styles.handle, classes.handle, {
          [styles.horizontalHeadHandle]: orientation === 'horizontal' && placement === 'head',
          [styles.horizontalTailHandle]: orientation === 'horizontal' && placement === 'tail',
          [styles.verticalHeadHandle]: orientation === 'vertical' && placement === 'head',
          [styles.verticalTailHandle]: orientation === 'vertical' && placement === 'tail',
        })}
      >
        <Input
          readOnly={readOnly}
          inputRef={inputRef}
          classes={{ root: styles.inputRoot }}
          value={readOnly ? displayFormatter(internal) : internal}
          onChange={onChangeValue}
          error={!(Number.isFinite(+internal) && +internal >= min && +internal <= max)}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles(({ isLightTheme }) => ({
  root: {
    position: 'absolute',
    '&:hover': {
      borderColor: '#03BCD4',
    },
    '&:active': {
      borderColor: '#03BCD4',
    },
    '&:hover $handle': {
      background: '#008BA3',
      borderColor: '#03BCD4',
    },
    '&:active $handle': {
      background: '#008BA3',
      borderColor: '#03BCD4',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalHeadRoot: {
    top: 0,
    bottom: 0,
    right: 5, // 5px by re-resizable
    borderRight: '2px solid #414141',
  },
  horizontalTailRoot: {
    top: 0,
    bottom: 0,
    left: 5, // 5px by re-resizable
    borderLeft: '2px solid #414141',
  },
  verticalHeadRoot: {
    left: 0,
    right: 0,
    bottom: 5, // 5px by re-resizable
    borderBottom: '2px solid #414141',
  },
  verticalTailRoot: {
    left: 0,
    right: 0,
    top: 5, // 5px by re-resizable
    borderTop: '2px solid #414141',
  },
  handle: {
    background: isLightTheme ? '#B1B1B1' : '#414141',
    border: '1px solid transparent',
    '& > p': {
      fontSize: '11px',
      textAlign: 'center',
      lineHeight: '16px',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1px',
  },
  horizontalHeadHandle: {
    width: '40px',
    height: '16px',
    borderTopLeftRadius: '2px',
    borderBottomLeftRadius: '2px',
  },
  horizontalTailHandle: {
    width: '40px',
    height: '16px',
    borderTopRightRadius: '2px',
    borderBottomRightRadius: '2px',
  },
  verticalHeadHandle: {
    width: '80%',
    maxWidth: '40px',
    height: '16px',
    borderTopLeftRadius: '2px',
    borderTopRightRadius: '2px',
  },
  verticalTailHandle: {
    width: '80%',
    maxWidth: '40px',
    height: '16px',
    borderBottomLeftRadius: '2px',
    borderBottomRightRadius: '2px',
  },
  inputRoot: {
    height: '100%',
    fontSize: '11px',
    '&::before': { borderWidth: 0 },
    '&::after': { borderWidth: '1px !important' },
    '& .MuiInputBase-input': {
      padding: 0,
      height: '100%',
      textAlign: 'center',
    },
    '&:hover::before': {
      borderWidth: '1px !important',
    },
  },
}));
