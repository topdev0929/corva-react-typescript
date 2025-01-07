import { useContext } from 'react';
import { PanToolOutlined } from '@material-ui/icons';

import ChartButton from '../ChartButton';
import ChartWrapperContext from '../../ChartWrapperContext';

const PanButton = ({ onClick, isHidden, ...props }) => {
  const { zoomStatus, isMinHeightChart, isZoomEnabled, handleIsZoomEnabledChange } =
    useContext(ChartWrapperContext);

  const handlePanClick = () => {
    handleIsZoomEnabledChange(false);
    onClick();
  };

  return (
    <ChartButton
      {...props}
      disabled={zoomStatus.isReset}
      tooltipProps={{ title: 'Pan', ...props.tooltipProps }}
      isActive={!isZoomEnabled}
      onClick={handlePanClick}
      isHidden={isMinHeightChart || isHidden}
    >
      <PanToolOutlined />
    </ChartButton>
  );
};

PanButton.defaultProps = {
  onClick: () => {},
  isHidden: false,
  tooltipProps: {},
};

export default PanButton;
