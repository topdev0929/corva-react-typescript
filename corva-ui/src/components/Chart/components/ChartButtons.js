import { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import ChartWrapperContext from '../ChartWrapperContext';

const useStyles = makeStyles({
  container: {
    position: 'absolute',
    right: '8px',
    display: 'flex',
    flexDirection: 'column',
    bottom: ({ marginBottom }) => marginBottom + 3,
  },
});

const ChartButtons = ({ children, className, ...otherProps }) => {
  const { chartStyles } = useContext(ChartWrapperContext);
  const classes = useStyles({ marginBottom: chartStyles.marginBottom });

  return (
    <div className={classNames(classes.container, className)} {...otherProps}>
      {children}
    </div>
  );
};

export default ChartButtons;
