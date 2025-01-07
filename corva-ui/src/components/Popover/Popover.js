import { Popover as MuiPopover } from '@material-ui/core';

import { useDelayedDcFullscreenElemOpen } from '../../effects/useDelayedDcFullscreenElemOpen';
import { useIsInsideDcApp } from '../DevCenter/DevCenterAppContainer/components';
import {
  IsInsideDcFullscreenElemProvider,
  useIsInsideDcFullscreenElem,
} from '../DevCenter/DevCenterAppContainer/components/DcFullscreenElemsCoordinatorProvider';

function DcPopover({ children, open: openProp, ...otherProps }) {
  const { delayedIsOpen } = useDelayedDcFullscreenElemOpen({ isOpen: openProp });

  return (
    <MuiPopover
      {...otherProps}
      open={delayedIsOpen}
      TransitionProps={{ ...otherProps.TransitionProps, enter: true, exit: false }}
    >
      <IsInsideDcFullscreenElemProvider>{children}</IsInsideDcFullscreenElemProvider>
    </MuiPopover>
  );
}

export function Popover(props) {
  const isInsideDcApp = useIsInsideDcApp();
  const isInsideDcFullscreenElem = useIsInsideDcFullscreenElem();

  const PopoverComponent = isInsideDcApp && !isInsideDcFullscreenElem ? DcPopover : MuiPopover;

  return <PopoverComponent {...props} />;
}
