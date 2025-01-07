const reducer = (state, { type, value }) => {
  switch (type) {
    case 'TOGGLE_REALTIME_SIDEBAR':
      return {
        ...state,
        isRealtimeSidebarOpen: value,
      };
    case 'OPEN_FILTER_SIDEBAR':
      return {
        ...state,
        isFilterSidebarOpen: true,
      };
    case 'CLOSE_FILTER_SIDEBAR':
      return {
        ...state,
        isFilterSidebarOpen: false,
      };
    case 'SET_IS_MOBILE_SIZE':
      return {
        ...state,
        isMobileSize: value,
      };
    case 'SET_IS_TABLET_SIZE':
      return {
        ...state,
        isTabletSize: value,
      };
    case 'SET_RT_SIDEBAR_HORIZONTAL_HEIGH':
      return {
        ...state,
        rtSidebarHorizontalHeigh: value,
      };
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
