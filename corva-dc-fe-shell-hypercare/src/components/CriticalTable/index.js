import { useState, useMemo, useContext } from 'react';
import { debounce, flattenDeep, sortBy, startCase, uniq } from 'lodash';
import classnames from 'classnames';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableSortLabel,
  Tooltip,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Checkbox,
  Divider,
  TextField,
  InputAdornment,
} from '@material-ui/core';

import AppContext from '~/AppContext';

import styles from './styles.css';
import IconPark from '../IconPark';

const debouncedFunc = debounce(callback => {
  callback();
}, 500);

const SORT_DIR = {
  asc: 'asc',
  desc: 'desc',
};
const TABLE_HEAD_COLUMNS = [
  { key: 'trace_name', label: 'Trace Name', sortName: 'trace_name' },
  { key: 'value', label: 'Value', sortName: 'value' },
  { key: 'unit', label: 'Unit', sortName: 'unit' },
  { key: 'zone', label: 'Zone', sortName: 'zone' },
  { key: 'phase', label: 'Phase', sortName: 'phase' },
];

const EVENT_TYPES = [
  { value: 'all', label: 'All' },
  // { value: 'measured', label: 'Measured Event Data', color: '#FFF350' },
  // { value: 'calculated', label: 'Calculated Event Data', color: '#64B5F6' },
];

function CriticalTable() {
  const { criticalEvents, manualPhases } = useContext(AppContext);

  const [expanded, setExpanded] = useState(true);
  const [sortName, setSortName] = useState('timestamp');
  const [sortDirection, setSortDireciton] = useState(SORT_DIR.asc);
  const [searchEventType, setSearchEventType] = useState('');
  const [filter, setFilter] = useState({
    eventType: EVENT_TYPES[0].value,
    unit: [],
    phase: [],
    zone: [],
  });

  const [filteredEvents, filterOptions] = useMemo(() => {
    const phaseArray = flattenDeep(Object.values(manualPhases));
    const grouped = criticalEvents.map(event => {
      const foundedPhase = phaseArray.find(
        phase => phase.start_time <= event.x && event.x < phase.end_time
      );
      return {
        ...event,
        zone: foundedPhase?.zone,
        phase: foundedPhase?.name,
      };
    });

    const filterOptions = {
      unit: uniq(grouped.map(item => item.unit)).sort(),
      phase: uniq(grouped.map(item => item.phase)).sort(),
      zone: uniq(grouped.map(item => item.zone)).sort(),
    };

    const filteredPhase = grouped.filter(
      item => !filter.phase.length || filter.phase.includes(item.phase)
    );
    const filteredUnit = filteredPhase.filter(
      item => !filter.unit.length || filter.unit.includes(item.unit)
    );
    const filteredZone = filteredUnit.filter(
      item => !filter.zone.length || filter.zone.includes(item.zone)
    );
    const filteredEventType = filteredZone.filter(
      item => !searchEventType || item.title.toLowerCase().includes(searchEventType.toLowerCase())
    );

    return [filteredEventType, filterOptions];
  }, [criticalEvents, manualPhases, filter, searchEventType]);

  const sortedEvents = useMemo(() => {
    if (sortDirection === SORT_DIR.asc) {
      return sortBy(filteredEvents, sortName);
    } else {
      return sortBy(filteredEvents, sortName).reverse();
    }
  }, [filteredEvents, sortName, sortDirection]);

  const handleToggleSort = columnKey => {
    if (columnKey === sortName) {
      setSortDireciton(sortDirection === SORT_DIR.asc ? SORT_DIR.desc : SORT_DIR.asc);
    } else {
      setSortName(columnKey);
      setSortDireciton(SORT_DIR.desc);
    }
  };

  const handleChangeFilter = (key, value) => {
    if (value.includes('all')) {
      if (!filter[key].includes('all')) {
        setFilter(prev => ({ ...prev, [key]: [] }));
      }
    } else if (value.length === filterOptions[key].length) {
      setFilter(prev => ({ ...prev, [key]: [] }));
    } else {
      setFilter(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleChangeSearchEvent = value => {
    debouncedFunc(() => setSearchEventType(value));
  };

  const renderValue = value => {
    if (!value || value.length === 0) return 'All';
    if (value.length === 1) return value[0];
    return `${value.length} Selected`;
  };

  return (
    <div className={styles.tableViewRoot}>
      <div className={styles.collapsedSummary}>
        <IconPark
          iconType="Down"
          size="medium"
          className={classnames(styles.expandIcon, { [styles.collapseIcon]: !expanded })}
          onClick={() => setExpanded(prev => !prev)}
        />
        <div className={styles.summaryHeader}>
          <span>Events</span>
          <Tooltip title="Critical Events">
            <div>
              <IconPark iconType="Info" className={styles.infoIcon} />
            </div>
          </Tooltip>
        </div>
      </div>
      <div
        className={classnames(styles.collapsedDetail, {
          [styles.collapsedDetailHidden]: !expanded,
        })}
      >
        <div className={styles.filterPanel}>
          <FormControl classes={{ root: styles.selectFormControl }}>
            <InputLabel shrink>Event Type</InputLabel>
            <Select value={filter.eventType}>
              {EVENT_TYPES.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl classes={{ root: styles.selectFormControl }}>
            <InputLabel shrink>Unit</InputLabel>
            <Select
              multiple
              displayEmpty
              value={filter.unit}
              renderValue={renderValue}
              onChange={e => handleChangeFilter('unit', e.target.value)}
            >
              <MenuItem value="all">
                <Checkbox checked={filter.unit.length === 0} />
                <ListItemText primary="All" />
              </MenuItem>
              <Divider />
              {filterOptions.unit.map(value => (
                <MenuItem key={value} value={value}>
                  <Checkbox checked={filter.unit.includes(value)} />
                  <ListItemText primary={value} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl classes={{ root: styles.selectFormControl }}>
            <InputLabel shrink>Phase</InputLabel>
            <Select
              multiple
              displayEmpty
              value={filter.phase}
              renderValue={renderValue}
              onChange={e => handleChangeFilter('phase', e.target.value)}
            >
              <MenuItem key={0} value="all">
                <Checkbox checked={filter.phase.length === 0} />
                <ListItemText primary="All" />
              </MenuItem>
              <Divider />
              {filterOptions.phase.map((value, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <MenuItem key={index + 1} value={value}>
                  <Checkbox checked={filter.phase.includes(value)} />
                  <ListItemText primary={value} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl classes={{ root: styles.selectFormControl }}>
            <InputLabel shrink>Zone</InputLabel>
            <Select
              multiple
              displayEmpty
              value={filter.zone}
              renderValue={renderValue}
              onChange={e => handleChangeFilter('zone', e.target.value)}
            >
              <MenuItem value="all">
                <Checkbox checked={filter.zone.length === 0} />
                <ListItemText primary="All" />
              </MenuItem>
              <Divider />
              {filterOptions.zone.map(value => (
                <MenuItem key={value} value={value}>
                  <Checkbox checked={filter.zone.includes(value)} />
                  <ListItemText primary={value} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <TableContainer className={styles.tableView}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell key="eventType" className={styles.headerCell}>
                  <TextField
                    placeholder="Search event..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconPark iconType="Search" className={styles.searchIcon} />
                        </InputAdornment>
                      ),
                      className: styles.searchInput,
                    }}
                    classes={{ root: styles.searchRoot }}
                    onChange={event => handleChangeSearchEvent(event.target.value)}
                  />
                </TableCell>
                {TABLE_HEAD_COLUMNS.map(column => (
                  <TableCell key={column.key} className={styles.headerCell}>
                    <TableSortLabel
                      active={column.key === sortName}
                      direction={column.key === sortName ? sortDirection : 'asc'}
                      onClick={() => handleToggleSort(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedEvents.length > 0 && (
                <TableRow>
                  <TableCell colSpan={100} className={styles.topShadow} />
                </TableRow>
              )}

              {sortedEvents.map(item => (
                <TableRow key={item.key} className={styles.tableRow}>
                  <TableCell className={styles.eventNameCell}>{item.title}</TableCell>
                  <TableCell>{item.trace ? startCase(item.trace) : '-'}</TableCell>
                  <TableCell>
                    {Number.isFinite(item.value)
                      ? parseFloat(item.value.toFixed(1)).toString()
                      : '-'}
                  </TableCell>
                  <TableCell>{item.unit || '-'}</TableCell>
                  <TableCell>{item.zone || '-'}</TableCell>
                  <TableCell>{item.phase || '-'}</TableCell>
                </TableRow>
              ))}

              {sortedEvents.length > 0 && (
                <TableRow>
                  <TableCell colSpan={100} className={styles.bottomShadow} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default CriticalTable;
