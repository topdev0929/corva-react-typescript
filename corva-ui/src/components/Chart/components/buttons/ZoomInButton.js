import { useContext } from 'react';
import { Add as ZoomInIcon } from '@material-ui/icons';
import ChartWrapperContext from '../../ChartWrapperContext';
import { HOT_KEYS, ZOOM_TYPE } from '../../constants';
import ChartButton from '../ChartButton';
import { useKeyboardControl } from '../../effects';

const ZoomInButton = ({ onClick, ...props }) => {
  const { zoomStatus, handleZoomEvent } = useContext(ChartWrapperContext);

  const handleZoomIn = () => {
    handleZoomEvent(ZOOM_TYPE.zoomIn);
    onClick();
  };

  useKeyboardControl({
    keyCode: HOT_KEYS.arrowUp,
    callback: handleZoomIn,
  });

  return (
    <ChartButton
      {...props}
      onClick={handleZoomIn}
      disabled={zoomStatus.isMax}
      tooltipProps={{ title: 'Zoom In', ...props.tooltipProps }}
    >
      <ZoomInIcon />
    </ChartButton>
  );
};

ZoomInButton.defaultProps = {
  onClick: () => {},
  tooltipProps: {},
};

export default ZoomInButton;
