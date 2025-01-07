import { Popper as MuiPopper } from '@material-ui/core';

import { useIsInsideDcApp } from '../DevCenter/DevCenterAppContainer/components';
import {
  IsInsideDcFullscreenElemProvider,
  useIsInsideDcFullscreenElem,
} from '../DevCenter/DevCenterAppContainer/components/DcFullscreenElemsCoordinatorProvider';
import { useDelayedDcFullscreenElemOpen } from '../../effects/useDelayedDcFullscreenElemOpen';

function DcPopper({ children, open: openProp, ...otherProps }) {
  const { delayedIsOpen } = useDelayedDcFullscreenElemOpen({ isOpen: openProp });

  return (
    <MuiPopper {...otherProps} open={delayedIsOpen}>
      <IsInsideDcFullscreenElemProvider>{children}</IsInsideDcFullscreenElemProvider>
    </MuiPopper>
  );
}

export function Popper(props) {
  const isInsideDcApp = useIsInsideDcApp();
  const isInsideDcFullscreenElem = useIsInsideDcFullscreenElem();

  const PopperComponent = isInsideDcApp && !isInsideDcFullscreenElem ? DcPopper : MuiPopper;

  return <PopperComponent {...props} />;
}
