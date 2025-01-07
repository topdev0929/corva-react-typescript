import { memo, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

import { withTheme } from '@material-ui/core';

import RealTimeBoxEditDialog from './RealTimeValuesBox/RealTimeBoxEditDialog';
import { RealtimeSidebarProps } from './types';
import { useStyles } from './RealTimeSidebarStyles';
import { ORIENTATIONS } from './enums';
import RealTimeSidebarContext from './RealTimeSidebarContext';
import SidebarFooter from './SidebarFooter';
import RealTimeBoxList from './RealTimeValuesBox/RealTimeBoxList';
import SidebarTitle from './SidebarTitle';

// This sidebar will receive all necesssary data from App (collections, realtime types etc.)
function RealTimeSidebar(props: RealtimeSidebarProps) {
  const {
    isSidebarOpen,
    handleOpenCloseSidebar,
    isResponsive,
    theme,
    sourceArray,
    findSource,
    onAppSettingChange,
    appSettings,
    assetKey,
    setting,
    realTimeTypes,
    isDialogOpen,
    paramToEdit,
    handleOpenCloseDialog,
    handleChangeParamToEdit,
    sidebarHorizontalHeight = 400,
    onLayoutChange = noop,
  } = props;
  const sidebarRef = useRef(null);
  const styles = useStyles({ sidebarHorizontalHeight });

  const orientation = isResponsive ? ORIENTATIONS.horizontal : ORIENTATIONS.vertical;

  const sidebarClass = classNames(isSidebarOpen && 'fullSize', {
    [styles.rtSidebarWhiteTheme]: theme.isLightTheme,
    [styles.rtSidebarVertical]: !isResponsive,
    [styles.rtSidebarHorizontal]: isResponsive,
  });

  const sidebarContentClass = classNames(styles.rtSidebarContent, orientation, {
    [styles.rtSidebarContentFullSize]: isSidebarOpen,
  });

  const sidebarHandlerClass = classNames([styles.rtSidebarHandler], {
    [styles.rtSidebarHandlerFullSize]: isSidebarOpen,
  });

  useEffect(() => {
    if (sidebarRef?.current?.clientHeight) {
      onLayoutChange(sidebarRef.current.clientHeight);
    }
  }, [sidebarRef?.current?.clientHeight, isSidebarOpen]);

  return (
    <RealTimeSidebarContext.Provider
      value={{
        isSidebarOpen,
        onAppSettingChange,
        appSettings,
        assetKey,
        setting,
        realTimeTypes,
        orientation,
        handleOpenCloseSidebar,
        handleChangeParamToEdit,
        handleOpenCloseDialog,
      }}
    >
      <div className={sidebarClass} ref={sidebarRef}>
        <div className={sidebarHandlerClass} onClick={() => handleOpenCloseSidebar(true)} />
        <SidebarTitle />
        <div className={sidebarContentClass}>
          <RealTimeBoxList sourceArray={sourceArray} findSource={findSource} />
          <RealTimeBoxEditDialog
            isDialogOpen={isDialogOpen}
            paramToEdit={paramToEdit}
            handleCloseRealTimeDialog={() => handleOpenCloseDialog(false)}
          />
        </div>
        <SidebarFooter
          onSidebarOpened={() => handleOpenCloseSidebar(true)}
          onSidebarClosed={() => handleOpenCloseSidebar(false)}
        />
      </div>
    </RealTimeSidebarContext.Provider>
  );
}

export default withTheme(memo(RealTimeSidebar as any));
