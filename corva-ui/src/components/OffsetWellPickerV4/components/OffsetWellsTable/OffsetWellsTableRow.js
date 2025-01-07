import { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { startCase, get, omit } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import { Typography, Checkbox, Tooltip, TableCell, TableRow } from '@material-ui/core';
import { convertValue } from '~/utils';
import {
  ColumnType,
  EXPANED_WELLNAME_WIDTH,
  LEAVE_TOUCH_DELAY,
  ROW_HEIGHT,
  StatusOptions,
  ViewType,
} from '../../constants';
import { SubjectWellMark } from './SubjectWellMark';
import styles from './OffsetWellsTableRow.module.css';
import ViewWellSectionsName from './ViewWellSectionsName';

const PAGE_NAME = 'OffsetWellsTableRow';
const AVG_CHAR_WIDTH = 8;

function formatMetricItem(data, metricsColumns, metricKey) {
  const metric = metricsColumns.find(item => item.key === metricKey);
  const value = get(data, metric.key);

  if (value === 'undefined') {
    return 'loading...';
  }

  if (Number.isFinite(value) || value) {
    return metric.unitType ? convertValue(value, metric.unitType, metric.from, metric.to) : value;
  }

  return '—';
}

function formatDistance(data, isImperial) {
  const value = get(data, ColumnType.distance);
  if (Number.isFinite(value)) {
    return isImperial ? value : convertValue(value, 'length', 'mi', 'km');
  }
  return '—';
}

function getCellWidth(columnsWithDict, key) {
  const cell = columnsWithDict.find(item => item.key === key);
  return cell?.width || 0;
}

function getTextWidth(strText) {
  const text = document.createElement('span');
  document.body.appendChild(text);
  text.style.font = 'Roboto';
  text.style.fontSize = '14px';
  text.style.letterSpacing = '0.01071em';
  text.style.height = 'auto';
  text.style.width = 'auto';
  text.style.position = 'absolute';
  text.style.whiteSpace = 'nowrap';
  text.innerHTML = strText;
  const textWidth = Math.ceil(text.clientWidth);
  document.body.removeChild(text);
  return textWidth;
}

const OffsetWellsTableRow = ({
  columnsWithDict,
  data,
  subjectWellId,
  metricsKeys,
  metricsColumns,
  handleChanageOffsetWell,
  isWellNameExpand,
  wellNameStyle,
  wellNameWidth,
  isViewOnly,
  isImperial,
  isLimitedOffsetwells,
  maxOffsetwellNumber,
  wellSections,
  setActiveWellId,
  viewType,
  newCheckedWellId,
  setNewCheckedWellId,
  index,
  flyDuration,
  isWDUser,
}) => {
  const isSubjectWell = subjectWellId === data.id;
  const borderStyle = { [styles.subjectWellRow]: isSubjectWell };
  const [isChecked, setIsChecked] = useState(data.checked);
  const tableRowRef = useRef();

  let isOverFlowWellName = false;
  const wellName = data[ColumnType.name] || '—';
  let truncWellName = wellName;
  if (!isWellNameExpand && wellNameWidth * 2 < wellName.length * AVG_CHAR_WIDTH) {
    const wellNameRealWidth = getTextWidth(wellName);
    if (wellNameRealWidth > wellNameWidth * 2) {
      const maxCounts = (wellNameWidth * 2) / (wellNameRealWidth / wellName.length);
      truncWellName = `${wellName.substring(0, maxCounts / 2 - 2)}\n... ${wellName.substring(
        wellName.length - maxCounts / 2 + 6
      )}`;
      isOverFlowWellName = true;
    }
  }

  const flyingAnimation = useCallback(
    (currentTop, targetTop, newCheckedWellId, ownId, flyDuration, delayTime = 0) => {
      const movingOffsetY = targetTop - currentTop;
      tableRowRef.current.style.position = 'absolute';
      tableRowRef.current.style.top = `${currentTop}px`;
      tableRowRef.current.style.zIndex = newCheckedWellId === ownId ? 4 : 3;
      tableRowRef.current.style.transition = `transform ${flyDuration}ms ease ${delayTime * 50}ms`;
      tableRowRef.current.style.transform = `translateY(${movingOffsetY}px)`;
    },
    []
  );
  const clearAnimation = useCallback(() => {
    tableRowRef.current.style.position = 'unset';
    tableRowRef.current.style.zIndex = 1;
    tableRowRef.current.style.transition = 'none';
    tableRowRef.current.style.transform = 'none';
  }, []);

  const handleChangeCheckbox = useCallback(
    checked => {
      setNewCheckedWellId(data.id);
      const updateData = omit(data, 'moveTo');
      handleChanageOffsetWell(updateData, checked);
      setIsChecked(checked);
    },
    [data, setNewCheckedWellId, handleChanageOffsetWell]
  );
  useEffect(() => {
    if (newCheckedWellId) {
      const currentTop = index * ROW_HEIGHT + 16;
      if (data.moveTo) {
        const targetTop = currentTop + ROW_HEIGHT * data.moveTo;
        flyingAnimation(
          currentTop,
          targetTop,
          newCheckedWellId,
          data.id,
          flyDuration,
          data.delayTime
        );
      }
    } else {
      clearAnimation();
    }
  }, [data.moveTo, newCheckedWellId]);

  useEffect(() => {
    setIsChecked(data.checked);
  }, [data.checked]);

  const getSectionColor = ([sectionName]) => {
    return wellSections.find(wellSection => wellSection.label === sectionName).color;
  };

  const wellSectionData = useMemo(() => {
    return data[ColumnType.wellSection];
  }, [data]);

  const checkboxTooltipText = useMemo(() => {
    if (isViewOnly) {
      return `View only mode. To edit offsets, use ${
        isWDUser ? 'Offset Selection App' : 'WellHub'
      }.`;
    } else if (isLimitedOffsetwells && !data.checked) {
      return `App can’t process more than (${maxOffsetwellNumber - 1}) Offset Wells.`;
    } else {
      return '';
    }
  }, [isViewOnly, isLimitedOffsetwells, data.checked]);

  const handleMouseEnter = () => {
    setActiveWellId(data.id);
  };

  const handleMouseLeave = () => {
    setActiveWellId(null);
  };

  return (
    <TableRow
      data-testid={`${PAGE_NAME}_row_${wellName}`}
      className={classNames(styles.bodyRow, {
        [styles.moveRow]: Math.abs(data.moveTo) === 1 && newCheckedWellId !== data.id,
      })}
      innerRef={tableRowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TableCell
        data-testid={`${PAGE_NAME}_well`}
        className={classNames(styles.bodyCell, styles.wellNameCell, borderStyle, {
          [wellNameStyle]: viewType !== ViewType.mobile,
          [styles.wellNameCellMobile]: viewType === ViewType.mobile,
        })}
        style={{
          width: isWellNameExpand
            ? EXPANED_WELLNAME_WIDTH
            : getCellWidth(columnsWithDict, ColumnType.name),
        }}
      >
        {isSubjectWell && (
          <SubjectWellMark
            className={classNames(styles.subjectWellMark, {
              [styles.subjectWellMarkMobile]: viewType === ViewType.mobile,
            })}
          />
        )}
        {!isSubjectWell && (
          <Tooltip
            title={checkboxTooltipText}
            placement="bottom-start"
            classes={{ tooltipPlacementBottom: styles.checkboxTooltip }}
          >
            <div>
              <Checkbox
                data-testid={`${PAGE_NAME}_checkbox`}
                size="medium"
                checked={isChecked}
                classes={{ disabled: styles.checkboxDisabled }}
                disabled={isViewOnly || (isLimitedOffsetwells && !data.checked)}
                onChange={event => handleChangeCheckbox(event.target.checked)}
              />
            </div>
          </Tooltip>
        )}
        <Tooltip title={isOverFlowWellName ? wellName : ''}>
          <Typography
            variant="body2"
            className={classNames(styles.wellNameCursor, {
              [styles.cellDataViewOnly]: isSubjectWell,
              [styles.wellNamePreWrap]: isOverFlowWellName,
            })}
          >
            {isOverFlowWellName ? truncWellName : wellName}
          </Typography>
        </Tooltip>
      </TableCell>

      <TableCell
        data-testid={`${PAGE_NAME}_dot`}
        className={classNames(styles.bodyCell, borderStyle)}
        style={{ width: getCellWidth(columnsWithDict, ColumnType.status) }}
      >
        {!isSubjectWell && (
          <Tooltip
            title={startCase(data[ColumnType.status])}
            enterTouchDelay={viewType === ViewType.mobile && 0}
            leaveTouchDelay={viewType === ViewType.mobile && LEAVE_TOUCH_DELAY}
          >
            <div className={styles.statusContainer}>
              <div
                data-testid={`${PAGE_NAME}_color`}
                className={styles.status}
                style={{
                  background: StatusOptions.find(item => item.value === data[ColumnType.status])
                    ?.color,
                }}
              />
            </div>
          </Tooltip>
        )}
      </TableCell>

      <TableCell
        data-testid={`${PAGE_NAME}_rig`}
        className={classNames(styles.bodyCell, borderStyle)}
        style={{ width: getCellWidth(columnsWithDict, ColumnType.rig) }}
      >
        <Typography variant="body2" className={styles.cellData}>
          {data[ColumnType.rig] && data[ColumnType.rig] !== 'Null' ? data[ColumnType.rig] : '—'}
        </Typography>
      </TableCell>

      <TableCell
        data-testid={`${PAGE_NAME}_distance`}
        className={classNames(styles.bodyCell, borderStyle)}
        style={{ width: getCellWidth(columnsWithDict, ColumnType.distance) }}
      >
        <Typography variant="body2" className={styles.cellData}>
          {formatDistance(data, isImperial)}
        </Typography>
      </TableCell>

      <TableCell
        data-testid={`${PAGE_NAME}_lastActive`}
        className={classNames(styles.bodyCell, borderStyle)}
        style={{ width: getCellWidth(columnsWithDict, ColumnType.lastActive) }}
      >
        <Typography variant="body2" className={styles.cellData}>
          {data[ColumnType.lastActive] && Number.isFinite(data[ColumnType.lastActive])
            ? moment.unix(data[ColumnType.lastActive]).format('MM/DD/YYYY')
            : '—'}
        </Typography>
      </TableCell>

      {metricsKeys.map(metricsKey => (
        <TableCell
          data-testid={`${PAGE_NAME}_${metricsKey}`}
          key={metricsKey}
          className={classNames(styles.bodyCell, borderStyle)}
          style={{ width: getCellWidth(columnsWithDict, metricsKey) }}
        >
          <Typography variant="body2" className={styles.cellData}>
            {formatMetricItem(data, metricsColumns, metricsKey)}
          </Typography>
        </TableCell>
      ))}

      <TableCell
        data-testid={`${PAGE_NAME}_wellSection`}
        className={classNames(styles.bodyCell, styles.lastCell, borderStyle)}
        style={{ width: getCellWidth(columnsWithDict, ColumnType.wellSection) }}
      >
        {wellSectionData && wellSectionData.length > 1 ? (
          <Tooltip
            classes={{
              tooltip: styles.customTooltip,
            }}
            title={<ViewWellSectionsName wellSectionNames={wellSectionData} />}
          >
            <div className={styles.sectionLength}>{wellSectionData.length}</div>
          </Tooltip>
        ) : (
          <Tooltip title={wellSectionData || ''}>
            <Typography
              variant="body2"
              className={styles.cellData}
              style={{
                color:
                  wellSectionData &&
                  wellSectionData.length === 1 &&
                  getSectionColor(wellSectionData),
              }}
            >
              {wellSectionData}
            </Typography>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
};

OffsetWellsTableRow.propTypes = {
  columnsWithDict: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  data: PropTypes.shape({
    id: PropTypes.number,
    checked: PropTypes.bool,
    name: PropTypes.string,
    status: PropTypes.string,
    moveTo: PropTypes.number,
    delayTime: PropTypes.number,
  }).isRequired,
  subjectWellId: PropTypes.number.isRequired,
  metricsKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  metricsColumns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleChanageOffsetWell: PropTypes.func.isRequired,
  isWellNameExpand: PropTypes.bool.isRequired,
  wellNameStyle: PropTypes.string.isRequired,
  wellNameWidth: PropTypes.number.isRequired,
  isViewOnly: PropTypes.bool.isRequired,
  isImperial: PropTypes.bool.isRequired,
  isLimitedOffsetwells: PropTypes.bool.isRequired,
  maxOffsetwellNumber: PropTypes.number.isRequired,
  wellSections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setActiveWellId: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
  newCheckedWellId: PropTypes.number.isRequired,
  setNewCheckedWellId: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  flyDuration: PropTypes.number.isRequired,
  isWDUser: PropTypes.bool.isRequired,
};

export default memo(OffsetWellsTableRow);
