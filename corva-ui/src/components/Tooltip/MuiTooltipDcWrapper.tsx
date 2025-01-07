import { useEffect, useState } from 'react';
import { Tooltip, TooltipProps } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { noop } from 'lodash';

import {
  IsInsideDcFullscreenElemProvider,
  useDcFullscreenElemsCoordinator,
} from '../DevCenter/DevCenterAppContainer/components/DcFullscreenElemsCoordinatorProvider';

// There is already an additional delay because of the need to wait for setIsFullscreenModalMode async calls.
// To not make it feels slow, it's better to leave this as 0 unless we REALLY want to have 300+ms of additional delays
const TRANSITION_DURATION = 0; // ms

/**
 * This is just a wrapper around MUI Tooltip component. It's only purpose it to call
 * setIsFullscreenModalMode function (https://www.notion.so/corva/Dev-Center-apps-fullscreen-modals-924d8de0cb334c2eb6530081934d50b5)
 * automatically to not make Corva users bother with calling it manually. It has exactly the same API as MUI Tooltip.
 * This component should be used only inside of DC apps.
 * In other cases, regular MUI tooltip should be the choice.
 */
export function MuiTooltipDcWrapper({
  onOpen: onOpenProp = noop,
  onClose: onCloseProp = noop,
  open: openProp = null,
  title: titleProp,
  TransitionProps = {},
  ...otherMuiTooltipProps
}: TooltipProps): JSX.Element {
  const [innerIsOpen, setInnerIsOpen] = useState(false);
  const { requestOpen, requestClose } = useDcFullscreenElemsCoordinator();
  const [componentId] = useState(() => uuidv4());

  const isControlledMode = typeof openProp === 'boolean';

  const onOpen = event => {
    onOpenProp(event);

    if (isControlledMode) {
      /**
       * If the component is controlled, we don't want to start
       * the transition to open state. Mui Tooltip just notifies
       * about the intention that a component wants to be opened
       * but we don't actually open it unless outside 'open' prop is changed to true
       */
      return;
    }

    requestOpen({ setIsOpened: setInnerIsOpen, id: componentId });
  };

  const onClose = event => {
    onCloseProp(event);

    if (isControlledMode) {
      /**
       * If the component is controlled, we don't want to start
       * the transition to closed state. Mui Tooltip just notifies
       * about the intention that a component wants to be closed
       * but we don't actually close it unless outside 'open' prop is changed to false
       */
      return;
    }

    requestClose({ setIsOpened: setInnerIsOpen, id: componentId });
  };

  useEffect(() => {
    if (openProp) {
      requestOpen({ setIsOpened: setInnerIsOpen, id: componentId });
    } else {
      requestClose({ setIsOpened: setInnerIsOpen, id: componentId });
    }
  }, [openProp]);

  useEffect(() => {
    return () => {
      requestClose({ setIsOpened: setInnerIsOpen, id: componentId });
    };
  }, []);

  return (
    <Tooltip
      {...otherMuiTooltipProps}
      open={innerIsOpen}
      onOpen={onOpen}
      onClose={onClose}
      TransitionProps={{
        ...TransitionProps,
        timeout: TRANSITION_DURATION,
      }}
      title={<IsInsideDcFullscreenElemProvider>{titleProp}</IsInsideDcFullscreenElemProvider>}
    />
  );
}
