import { useEffect, useState } from 'react';
import { useDcFullscreenElemsCoordinator } from '../components/DevCenter/DevCenterAppContainer/components';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  isOpen: boolean;
}

/*
  This hooks is used in DC elements that should be opened in fullscreen.
  As DC apps are located within iframes, we need to enter/exit
  DC fullscreen mode. So, components that use this hook replace their
  open prop with this delayed open prop which handles DC fullscreen mode
  enter / exit
*/
export function useDelayedDcFullscreenElemOpen({ isOpen }: Props) {
  // element closed by default and invoke request open first render, which add more smooth element mount
  const [delayedIsOpen, setDelayedIsOpen] = useState(false);
  const { requestOpen, requestClose } = useDcFullscreenElemsCoordinator();
  const [componentId] = useState(() => uuidv4());

  useEffect(() => {
    if (isOpen) {
      requestOpen({ setIsOpened: setDelayedIsOpen, id: componentId });
    } else {
      requestClose({ setIsOpened: setDelayedIsOpen, id: componentId });
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      requestClose({ setIsOpened: setDelayedIsOpen, id: componentId }, true);
    };
  }, []);

  return {
    delayedIsOpen,
  };
}
