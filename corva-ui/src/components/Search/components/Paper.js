import { useRef } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';

import useOutsideClick from '~effects/useOutsideClick';
import usePaperContext from '../context';

const useStyles = makeStyles(() => ({
  paper: {
    boxShadow:
      '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
    backgroundColor: '#424242',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    borderRadius: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
}));

const Paper = ({
  className,
  children,

  ...otherProps
}) => {
  const classes = useStyles();
  const paperRef = useRef();

  const {
    loading,
    AllSelectComponent,
    RecentSearchesComponent,
    GroupsComponent,
    isEmptyOptions,
    onOutsideClick,
  } = usePaperContext();

  useOutsideClick(paperRef, onOutsideClick, [
    '#removeGroupIcon',
    '#selectAllLabel',
    '#selectedOptions',
    '.MuiInput-input',
  ]);

  return (
    <div {...otherProps} ref={paperRef} className={classNames(className, classes.paper)}>
      {!loading && (
        <>
          {GroupsComponent} {RecentSearchesComponent} {AllSelectComponent}
        </>
      )}
      {isEmptyOptions && GroupsComponent ? null : children}
    </div>
  );
};

export default Paper;
