import { useState } from 'react';
import PropTypes from 'prop-types';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import VirtualizedTable from '~/components/VirtualizedTable';
import { VirtualizedTableComponent } from '~/components/VirtualizedTable/VirtualizedTable';

// NOTE: Test data with 200 rows
const sample = [
  ['Frozen yoghurt', 159, 6.0, 24, 4.0],
  ['Ice cream sandwich', 237, 9.0, 37, 4.3],
  ['Eclair', 262, 16.0, 24, 6.0],
  ['Cupcake', 305, 3.7, 67, 4.3],
  ['Gingerbread', 356, 16.0, 49, 3.9],
];

function createData(id, dessert, calories, fat, carbs, protein) {
  return { id, dessert, calories, fat, carbs, protein };
}

const rows = [];

for (let i = 0; i < 200; i += 1) {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  rows.push(createData(i, ...randomSelection));
}

// NOTE: Table Columns
const columns = [
  {
    label: 'Dessert',
    key: 'dessert',
    show: true,
  },
  {
    label: 'Calories',
    key: 'calories',
    show: true,
  },
  {
    label: 'Fat',
    key: 'fat',
    show: true,
  },
  {
    label: 'Carbs',
    key: 'carbs',
    show: true,
  },
  {
    label: 'Protein',
    key: 'protein',
    show: true,
  },
];

export const WithSettings = props => {
  const [savedColumns, setSavedColumns] = useState(columns);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <VirtualizedTable
        useColumnSetting={props.useColumnSetting}
        columns={columns}
        savedColumns={savedColumns}
        onChangeColumns={newColumns => setSavedColumns(newColumns)}
        data={rows}
        headerHeight={props.headerHeight}
        rowHeight={props.rowHeight}
      />
    </div>
  );
};

WithSettings.propTypes = {
  headerHeight: PropTypes.number,
  rowHeight: PropTypes.number,
  useColumnSetting: PropTypes.bool,
};

WithSettings.defaultProps = {
  headerHeight: 45,
  rowHeight: 45,
  useColumnSetting: true,
};

export default {
  title: 'Components/VirtualizedTable',
  component: VirtualizedTableComponent,
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/VirtualizedTable/index.js',
  },
};
