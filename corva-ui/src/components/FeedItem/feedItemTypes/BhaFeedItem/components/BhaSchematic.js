import { shape, func, bool } from 'prop-types';
import { Dialog, DialogContent, makeStyles } from '@material-ui/core';

import BhaIndicator from '~/components/Drillstring/BhaIndicator';
import BHASchematic from '~/components/Drillstring/BHASchematic';
import DrillstringDetail from '~/components/Drillstring/DrillstringDetail';

import { getUnitDisplay } from '~/utils/convert';
import { getBHAInformation, calculateBHALengthMax, getBHASchematic } from '~/utils/bha';

const useStyles = makeStyles({
  wrapper: {
    width: 200,
    cursor: 'pointer',
    marginTop: -52,
    marginBottom: -52,
  },
  bhaDetail: {
    maxWidth: 1500,
    maxHeight: '80%',
  },
});

const BhaSchematic = ({
  feedItem,
  drillStringData,
  handleShowDrillstringDetailDialog,
  isShowDrillstringDetailDialog,
  handleHideDrillstringDetailDialog,
}) => {
  const classes = useStyles();

  const wellId = feedItem.well?.id;
  const bhaId = feedItem.context?.bha?.data?.id;

  const bhaInfo = getBHAInformation(wellId, bhaId, drillStringData);
  const bhaLengthMax = calculateBHALengthMax(drillStringData);
  const components = bhaInfo.data?.components;
  const schematicData = components && getBHASchematic(components);

  return (
    <>
      <div className={classes.wrapper} onClick={handleShowDrillstringDetailDialog}>
        {schematicData && (
          <BHASchematic key={wellId} schematic={schematicData} bhaLengthMax={bhaLengthMax} />
        )}
      </div>

      <BhaIndicator align="left" />

      <Dialog
        classes={{
          paperScrollPaper: classes.bhaDetail,
        }}
        open={isShowDrillstringDetailDialog}
        onClose={handleHideDrillstringDetailDialog}
        scroll="paper"
      >
        <DialogContent>
          <DrillstringDetail
            drillStringInfo={bhaInfo}
            unit={getUnitDisplay('length')}
            onDone={handleHideDrillstringDetailDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

BhaSchematic.propTypes = {
  feedItem: shape().isRequired,
  drillStringData: shape().isRequired,
  isShowDrillstringDetailDialog: bool.isRequired,
  handleShowDrillstringDetailDialog: func.isRequired,
  handleHideDrillstringDetailDialog: func.isRequired,
};

export default BhaSchematic;
