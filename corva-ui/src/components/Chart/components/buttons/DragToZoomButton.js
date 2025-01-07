import { useContext } from 'react';
import { BorderStyle } from '@material-ui/icons';
import ChartButton from '../ChartButton';
import ChartWrapperContext from '../../ChartWrapperContext';

const DragToZoomButton = ({ onClick, isHidden, ...props }) => {
  const { isMinHeightChart, isZoomEnabled, handleIsZoomEnabledChange } =
    useContext(ChartWrapperContext);

  const handleDragToZoomClick = () => {
    handleIsZoomEnabledChange(true);
    onClick();
  };

  return (
    <ChartButton
      {...props}
      tooltipProps={{ title: 'Drag To Zoom', ...props.tooltipProps }}
      isActive={isZoomEnabled}
      onClick={handleDragToZoomClick}
      isHidden={isMinHeightChart || isHidden}
    >
      <BorderStyle />
    </ChartButton>
  );
};

DragToZoomButton.defaultProps = {
  onClick: () => {},
  isHidden: false,
  tooltipProps: {},
};

export default DragToZoomButton;
