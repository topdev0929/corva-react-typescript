import { useState, useEffect } from 'react';
import { ColumnType, TableColumns } from '../constants';

export function useTableColumns(metricsKeys) {
  const [columnsWithDict, setColumnsWithDict] = useState(null);

  // NOTE: Calculate columns with metrics
  useEffect(() => {
    if (!metricsKeys) return;
    const wIndex = metricsKeys.length < 3 ? metricsKeys.length : 3;
    const columns = TableColumns.reduce((acc, column) => {
      if (column.type === ColumnType.metrics) {
        return metricsKeys.reduce(
          (res, key) => [...res, { ...column, key, width: column.width[wIndex] }],
          acc
        );
      }
      return acc.concat({ ...column, width: column.width[wIndex] });
    }, []);
    setColumnsWithDict(columns);
  }, [metricsKeys]);

  return columnsWithDict;
}
