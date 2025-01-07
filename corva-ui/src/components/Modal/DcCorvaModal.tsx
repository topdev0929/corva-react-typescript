import { useDelayedDcFullscreenElemOpen } from '../../effects/useDelayedDcFullscreenElemOpen';
import { IsInsideDcFullscreenElemProvider } from '../DevCenter/DevCenterAppContainer/components/DcFullscreenElemsCoordinatorProvider';

import { CorvaModal } from './CorvaModal';
import { ModalProps } from './types';

export function DcCorvaModal({ open: openProp, ...otherProps }: ModalProps): JSX.Element {
  const { delayedIsOpen } = useDelayedDcFullscreenElemOpen({ isOpen: openProp });

  return (
    <IsInsideDcFullscreenElemProvider>
      <CorvaModal open={delayedIsOpen} {...otherProps} />
    </IsInsideDcFullscreenElemProvider>
  );
}
