import { useContext } from 'react';
import classNames from 'classnames';
import { UnfoldLess, UnfoldMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';

import ChartButton from '../ChartButton';
import ChartWrapperContext from '../../ChartWrapperContext';
import { useHideAxes } from '../../effects';

const useStyles = makeStyles({
  hideAxesButton: {
    top: 0,
    transform: 'rotate(90deg)',
  },
});

const HideAxesButton = ({ onClick, isHidden, ...props }) => {
  const { chart, handleChangeChartStyles } = useContext(ChartWrapperContext);
  const { isHiddenAxes, handleAxesHide } = useHideAxes({
    chart,
    onChartStylesChange: handleChangeChartStyles,
  });
  const classes = useStyles();

  return (
    <ChartButton
      {...props}
      className={classNames(classes.hideAxesButton, props.className)}
      tooltipProps={{ title: isHiddenAxes ? 'Show Axes' : 'Hide Axes', ...props.tooltipProps }}
      onClick={handleAxesHide}
    >
      {isHiddenAxes ? <UnfoldMore /> : <UnfoldLess />}
    </ChartButton>
  );
};

HideAxesButton.defaultProps = {
  tooltipProps: {},
};

export default HideAxesButton;
