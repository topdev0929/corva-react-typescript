import { observer } from 'mobx-react-lite';
import { FC, useMemo } from 'react';

import { useOPStore } from '@/contexts/optimization-parameters';
import { VIEW_TYPES } from '@/stores/optimization-parameters';
import { FitInParameters } from '@/entities/optimization-parameter';

import { CellProps } from './types';
import { TableRow } from './Row';
import { TableHeader } from './Header';
import { FitInChart } from '../FitInChart';
import { FitInValue } from '../FitInValue';
import { RecommendedValues } from '../RecommendedValues';
import styles from './index.module.css';

export const Table = observer(() => {
  const store = useOPStore();

  const isChartView = store.viewType === VIEW_TYPES.CHART;
  const isTableView = store.viewType === VIEW_TYPES.TABLE;
  const columns = useMemo(() => ['Title', 'WOB', 'RPM', 'Mud Flow in'], []);

  const renderActualValues = () => {
    return store.fitInDIParametersList.map(parameters => (
      <FitInValue fitInParameters={parameters} key={parameters.id} />
    ));
  };

  const renderFitInParameters = (fitInParametersList: FitInParameters[]) => {
    const Cell: FC<CellProps> = isChartView ? FitInChart : RecommendedValues;
    return fitInParametersList.map(parameters => (
      <Cell fitInParameters={parameters} key={parameters.id} />
    ));
  };

  const placeholders = Array.from({ length: 3 }, (_, index) => (
    <span key={index} className={styles.placeholder}>
      TBD
    </span>
  ));

  return (
    <div
      className={styles.container}
      style={{ gridTemplateColumns: `repeat(${columns.length}, auto)` }}
    >
      <TableHeader columns={columns} />
      {!store.isEmpty ? (
        <>
          {isTableView && <TableRow title="Actual">{renderActualValues()}</TableRow>}
          <TableRow title="Rec. DI">{renderFitInParameters(store.fitInDIParametersList)}</TableRow>
          <TableRow title="Rec. ROP">
            {renderFitInParameters(store.fitInROPParametersList)}
          </TableRow>
        </>
      ) : (
        <>
          {isTableView && (
            <TableRow title="Actual">
              {placeholders}
            </TableRow>
          )}
          <TableRow title="Rec. DI">{placeholders}</TableRow>
          <TableRow title="Rec. ROP">{placeholders}</TableRow>
        </>
      )}
    </div>
  );
});

Table.displayName = 'Table';
