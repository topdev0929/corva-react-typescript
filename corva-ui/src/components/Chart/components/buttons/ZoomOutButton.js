import { useContext } from 'react';
import { Remove as ZoomOutIcon } from '@material-ui/icons';
import ChartWrapperContext from '../../ChartWrapperContext';
import { HOT_KEYS, ZOOM_TYPE } from '../../constants';
import ChartButton from '../ChartButton';
import { useKeyboardControl } from '../../effects';

const ZoomOutButton = ({ onClick, ...props }) => {
  const { handleZoomEvent, zoomStatus } = useContext(ChartWrapperContext);

  const handleZoomOut = () => {
    handleZoomEvent(ZOOM_TYPE.zoomOut);
    onClick();
  };

  useKeyboardControl({
    keyCode: HOT_KEYS.arrowDown,
    callback: handleZoomOut,
  });

  return (
    <ChartButton
      {...props}
      onClick={handleZoomOut}
      tooltipProps={{ title: 'Zoom Out', ...props.tooltipProps }}
      disabled={zoomStatus.isReset}
    >
      <ZoomOutIcon />
    </ChartButton>
  );
};

ZoomOutButton.defaultProps = {
  onClick: () => {},
  tooltipProps: {},
};

export default ZoomOutButton;
