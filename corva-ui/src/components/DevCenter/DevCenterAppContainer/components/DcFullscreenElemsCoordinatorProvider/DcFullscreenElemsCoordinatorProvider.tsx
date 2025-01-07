import {
  useMemo,
  useRef,
  useContext,
  createContext,
  FC,
  SetStateAction,
  Dispatch,
  ReactNode,
} from 'react';

enum STATES {
  CLOSED = 'CLOSED',
  OPENNING = 'OPENNING',
  OPENED = 'OPENED',
  CLOSING = 'CLOSING',
}

interface Props {
  setIsFullscreenModalMode: (arg: SetStateAction<boolean>) => Promise<void>;
  children: ReactNode | ReactNode[];
}

interface ElementInfo {
  setIsOpened: Dispatch<SetStateAction<boolean>>;
  id: string;
}

interface Api {
  requestOpen: (elInfo: ElementInfo) => void;
  requestClose: (elInfo: ElementInfo, isUnmount?: boolean) => void;
}

interface StartTransitionProps {
  transitionFn: () => Promise<void>;
  plannedAfterTransitionFinishCb: () => void;
}

type State = {
  [id in string]: {
    name: STATES;
    currentElementInfo: null | ElementInfo;
  };
};

const DcFullscreenElemsCoordinator = createContext<Api | null>(null);

/**
 * Component designed to manage fullscreen elements inside of iframe(such as tooltips, popovers, modals).
 * State changes flow:
 *
 * ↓closed↓
 * ↓openning↓
 * {call transitionFn} stretches iframe to fullscreen(returns promise).
 * {call plannedAfterTransitionFinishCb} just open planned element by default.
 * ↓opened↓
 * ↓closing transition↓
 * {call transitionFn} shrinks iframe to app size. In some cases another element could be opened. We don't want to call transitionFn in this case
 * {call plannedAfterTransitionFinishCb} just go to closed state of element.
 *
 * At any of these states a element can request to open\close itself. See requestOpen/requestClose for more details
 */

export const DcFullscreenElemsCoordinatorProvider: FC<Props> = ({
  setIsFullscreenModalMode,
  children,
}) => {
  const initialElementState = {
    name: STATES.CLOSED,
    currentElementInfo: null,
  };
  const state = useRef<State>({});

  const getIsSomeElemOpeningOrOpened = () => {
    return Object.keys(state.current).some(elemId => {
      const elemState = state.current[elemId].name;
      return elemState === STATES.OPENNING || elemState === STATES.OPENED;
    });
  };

  const api = useMemo(() => {
    async function startTransition({
      transitionFn,
      plannedAfterTransitionFinishCb,
    }: StartTransitionProps) {
      try {
        await transitionFn();
      } catch (err) {
        console.error('Transition error: ', err);
      }
      plannedAfterTransitionFinishCb();
    }

    function goToOpenedState(elementInfo: ElementInfo) {
      const { id } = elementInfo;
      state.current[id] = {
        name: STATES.OPENED,
        currentElementInfo: elementInfo,
      };
      state.current[id].currentElementInfo.setIsOpened(true);
    }

    function goToOpenningState(elementInfo: ElementInfo) {
      const { id } = elementInfo;
      state.current[id] = {
        name: STATES.OPENNING,
        currentElementInfo: null,
      };

      startTransition({
        transitionFn: () => setIsFullscreenModalMode(true),
        plannedAfterTransitionFinishCb: () => {
          goToOpenedState(elementInfo);
        },
      });
    }

    function goToClosingState(id: string) {
      state.current[id].name = STATES.CLOSING;

      startTransition({
        // current element is in closing state, so if any other is opening or opened
        // then don't change full screen mode to avoid shrinking of opened element
        transitionFn: async () => {
          state.current[id].currentElementInfo?.setIsOpened(false);
          state.current[id].currentElementInfo = null;
          if (!getIsSomeElemOpeningOrOpened()) {
            return setIsFullscreenModalMode(false);
          }
        },
        plannedAfterTransitionFinishCb: () => {
          state.current[id].name = STATES.CLOSED;
        },
      });
    }

    const requestOpen = (elementInfo: ElementInfo) => {
      const { id } = elementInfo;
      if (!state.current?.[id]) {
        state.current[id] = initialElementState;
      }

      switch (state.current[elementInfo.id].name) {
        case STATES.CLOSED:
          goToOpenningState(elementInfo);
          break;
        case STATES.OPENNING:
          goToOpenedState(elementInfo);
          break;
        case STATES.OPENED:
          goToOpenedState(elementInfo);
          break;
        case STATES.CLOSING:
          goToOpenningState(elementInfo);
          break;
        default:
      }
    };

    const requestClose = (elementInfo: ElementInfo, isUnmount: boolean = false) => {
      const { id } = elementInfo;
      if (!state.current?.[id]) {
        state.current[id] = initialElementState;
      }

      if (isUnmount) {
        delete state.current[id];
        return setIsFullscreenModalMode(false);
      }

      goToClosingState(id);
    };

    return {
      requestOpen,
      requestClose,
    };
  }, [setIsFullscreenModalMode]);

  return (
    <DcFullscreenElemsCoordinator.Provider value={api}>
      {children}
    </DcFullscreenElemsCoordinator.Provider>
  );
};

export function useDcFullscreenElemsCoordinator() {
  return useContext(DcFullscreenElemsCoordinator);
}
