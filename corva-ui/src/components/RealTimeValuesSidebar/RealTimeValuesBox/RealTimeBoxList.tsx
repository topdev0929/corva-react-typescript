import { memo, useContext } from 'react';
import DraggableList from 'react-draggable-list';

import { makeStyles } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { IconButton } from '~/components';

import RealTimeBox from './RealTimeBox';
import { RealTimeBoxListProps } from '../types';
import RealTimeSidebarContext from '../RealTimeSidebarContext';
import { ORIENTATIONS } from '../enums';

const useStyles = makeStyles(() => ({
  boxListVertical: {
    padding: '10px 0 16px',
    overflowX: 'hidden',
  },
  rtBoxListHorizontal: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  cTpRtBoxAddButtonContainer: {
    marginTop: 8,
    textAlign: 'center',
  },
}));

function RealTimeBoxList(props: RealTimeBoxListProps) {
  const { sourceArray, findSource } = props;
  const classes = useStyles();

  const {
    onAppSettingChange,
    appSettings,
    assetKey,
    orientation,
    realTimeTypes,
    setting,
    handleOpenCloseDialog,
  } = useContext(RealTimeSidebarContext);

  const handleOrderComponents = newArr => {
    const newOrder = newArr.map(item => item.key);

    onAppSettingChange('rtValuesSetting', {
      ...appSettings.rtValuesSetting,
      [assetKey]: newOrder,
    });
  };

  return (
    <>
      {orientation === ORIENTATIONS.vertical ? (
        <div className={classes.boxListVertical}>
          <DraggableList
            list={sourceArray}
            itemKey={(itm: any) => itm.key}
            template={RealTimeBox as any}
            padding={0}
            unsetZIndex
            container={() => document.body}
            onMoveEnd={handleOrderComponents}
          />
          <div className={classes.cTpRtBoxAddButtonContainer}>
            <IconButton
              color="primary"
              tooltipProps={{ title: 'Add' }}
              onClick={handleOpenCloseDialog}
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>
      ) : (
        <div className={classes.rtBoxListHorizontal}>
          {setting.map(param => (
            <RealTimeBox
              key={`${param}`}
              isDraggable={false}
              item={findSource(param, realTimeTypes)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default memo(RealTimeBoxList);
