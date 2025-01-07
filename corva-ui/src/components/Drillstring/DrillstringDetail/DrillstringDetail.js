import { string, number, shape, func } from 'prop-types';
import { useState, useMemo } from 'react';

import { Button, Dialog, DialogContent } from '@material-ui/core';

import { convertValue } from '~/utils';

import BHATable from '../BHATable';
import BHAComponentDetail from '../BHAComponentDetail';

import styles from './styles.css';

const DrillstringDetail = ({ onDone, drillStringInfo, holeDepth, unit }) => {
  const [selectedComponentId, setSelectedComponentId] = useState();

  const bhaId = drillStringInfo.data?.id;
  const startDepth = Math.floor(convertValue(drillStringInfo.data?.start_depth, 'length', 'ft'));

  const bhaComponents = drillStringInfo.data?.components || [];

  const selectedBHAComponent = useMemo(() => {
    return bhaComponents.find(component => component.id === selectedComponentId);
  }, [bhaComponents, selectedComponentId]);

  return (
    <div className={styles.detailsPane}>
      <header>
        <Button variant="contained" className={styles.detailDone} onClick={onDone}>
          Close
        </Button>
        <div className={styles.detailTitleGroup}>
          <span className={styles.detailTitle}>BHA Details</span>
          <span className={styles.detailTitleSeparator}> &middot; </span>
          <span className={styles.detailTitleMore}>BHA # {bhaId}</span>
          <span className={styles.detailTitleSeparator}> &middot; </span>
          <span className={styles.detailTitleMore}>{`${startDepth} - ${holeDepth} ${unit}`}</span>
        </div>
      </header>

      <BHATable
        components={bhaComponents}
        onSelectComponent={({ id }) => setSelectedComponentId(id)}
      />

      <Dialog
        open={!!selectedComponentId}
        onClose={() => setSelectedComponentId(null)}
        scroll="paper"
      >
        <DialogContent>
          <BHAComponentDetail
            component={selectedBHAComponent}
            onDone={() => setSelectedComponentId(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

DrillstringDetail.propTypes = {
  drillStringInfo: shape().isRequired,
  holeDepth: number.isRequired,
  unit: string.isRequired,
  onDone: func.isRequired,
};

export default DrillstringDetail;
