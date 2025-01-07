import { FunctionComponent } from 'react';
import { sortBy } from 'lodash';
import DraggableList from 'react-draggable-list';
import { makeStyles } from '@material-ui/core';

import { PadOrderSetting, Well, WellsStagesData } from '../../types';
import Legend from '../Legend';

import WellStages from './WellStages';
import StageNumbers from './StageNumbers';

const useStyles = makeStyles({
  wellStagesList: {},
});

type WellStagesListProps = {
  stageData: WellsStagesData;
  wells: Well[];
  designRate: number;
  designPressure: number;
  orderSetting: PadOrderSetting;
  onOrderSettingChange: (orderSetting: PadOrderSetting) => void;
};

const WellStagesList: FunctionComponent<WellStagesListProps> = ({
  wells,
  stageData,
  designRate,
  designPressure,
  orderSetting,
  onOrderSettingChange,
}) => {
  const classes = useStyles();
  const maxStageNumber = Math.max(
    ...Object.values(stageData).map(stage => stage.lastDesignStage || 0)
  );

  const componentArray = sortBy(wells, well => orderSetting[well.asset_id]).map(well => ({
    id: String(well.asset_id),
    assetId: well.asset_id,
    wellName: well.name,
    ...stageData[well.asset_id],
  }));

  const handleReorderComponents = newArray => {
    const newOrder = newArray.reduce(
      (result, item, index) => ({ ...result, [item.id.toString()]: index }),
      {}
    );
    onOrderSettingChange(newOrder);
  };

  return (
    <div className={classes.wellStagesList}>
      <DraggableList
        list={componentArray}
        itemKey={item => item.id}
        template={WellStages as any}
        padding={0}
        unsetZIndex
        container={() => document.body}
        commonProps={{
          maxStageNumber,
          designRate,
          designPressure,
        }}
        onMoveEnd={newArr => handleReorderComponents(newArr)}
      />
      <StageNumbers maxStageNumber={maxStageNumber} />
      <Legend />
    </div>
  );
};

export default WellStagesList;
