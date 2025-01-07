import { useIsInsideDcApp } from '../DevCenter/DevCenterAppContainer/components';
import { useIsInsideDcFullscreenElem } from '../DevCenter/DevCenterAppContainer/components/DcFullscreenElemsCoordinatorProvider';

import { CorvaModal } from './CorvaModal';
import { DcCorvaModal } from './DcCorvaModal';
import { ModalProps } from './types';

export default function Modal(props: ModalProps): JSX.Element {
  const isInsideDcApp = useIsInsideDcApp();
  const isInsideDcFullscreenElem = useIsInsideDcFullscreenElem();

  const ModalComponent = isInsideDcApp && !isInsideDcFullscreenElem ? DcCorvaModal : CorvaModal;

  return <ModalComponent {...props} />;
}
