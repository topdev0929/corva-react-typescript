import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@material-ui/core';

import { useIsInsideDcFullscreenElem } from '../DevCenter/DevCenterAppContainer/components/DcFullscreenElemsCoordinatorProvider';
import { useIsInsideDcApp } from '../DevCenter/DevCenterAppContainer/components/IsInsideDcAppProvider';
import { MuiTooltipDcWrapper } from './MuiTooltipDcWrapper';

interface TooltipProps extends MuiTooltipProps {
  isFullScreen?: boolean;
}

export function Tooltip({ isFullScreen = true, ...tooltipProps }: TooltipProps): JSX.Element {
  const isInsideDcApp = useIsInsideDcApp();
  const isInsideDcFullscreenElem = useIsInsideDcFullscreenElem();

  const TooltipComponent =
    isFullScreen && isInsideDcApp && !isInsideDcFullscreenElem ? MuiTooltipDcWrapper : MuiTooltip;

  return <TooltipComponent {...tooltipProps} />;
}
