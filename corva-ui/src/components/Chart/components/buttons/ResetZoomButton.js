import { useContext } from 'react';
import { ReplayOutlined } from '@material-ui/icons';
import ChartWrapperContext from '../../ChartWrapperContext';
import ChartButton from '../ChartButton';

const ResetZoomButton = ({ onClick, isHidden, isVisible, ...props }) => {
  const { isMinHeightChart, handleResetZoom, zoomStatus } = useContext(ChartWrapperContext);

  const handleZoomOut = () => {
    handleResetZoom();
    onClick();
  };

  const isResetZoomHidden = zoomStatus.isReset || isMinHeightChart || isHidden;

  return (
    <ChartButton
      {...props}
      onClick={handleZoomOut}
      tooltipProps={{ title: 'Reset Zoom', ...props.tooltipProps }}
      isHidden={isResetZoomHidden && !isVisible}
    >
      <ReplayOutlined />
    </ChartButton>
  );
};

ResetZoomButton.defaultProps = {
  onClick: () => {},
  isHidden: false,
  isVisible: false,
  tooltipProps: {},
};

export default ResetZoomButton;
