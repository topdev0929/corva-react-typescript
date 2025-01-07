import { useEffect, useRef, useState, memo } from 'react';
import classNames from 'classnames';
import { List, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette }) => ({
  list: {
    fontSize: 16,
    '& .MuiAutocomplete-option': {
      display: 'block',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',

      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
      },
    },
    '& .MuiAutocomplete-option[aria-selected="true"]': {
      backgroundColor: 'initial',
    },
    '& .MuiAutocomplete-option:active': {
      backgroundColor: 'initial',
    },
  },
  withShadow: {
    '&::after': {
      content: "''",
      position: 'sticky',
      width: '100%',
      display: 'block',
      bottom: '-8px',
      height: 8,
      backgroundImage: `linear-gradient(180deg, rgba(65, 65, 65, 0) 0%, ${palette.background.b9} 100%)`,
    },
    '&::before': {
      content: "''",
      position: 'sticky',
      width: '100%',
      display: 'block',
      height: 8,
      top: '-8px',
      backgroundImage: `linear-gradient(0deg, rgba(65, 65, 65, 0) 0%, ${palette.background.b9} 100%)`,
    },
  },
}));

const Listbox = props => {
  const [isScrollable, setIsScrollable] = useState(false);
  const listRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    setIsScrollable(listRef.current?.scrollHeight > listRef.current?.clientHeight);
  });

  return (
    <List
      {...props}
      className={classNames(props.className, classes.list, isScrollable && classes.withShadow)}
      ref={listRef}
      role="listbox"
    />
  );
};

export default memo(Listbox);
