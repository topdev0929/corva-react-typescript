import { memo } from 'react';
import { shape, arrayOf, func, bool, string } from 'prop-types';
import { makeStyles, Checkbox, Tooltip, useTheme } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

import NumberCircle from './NumberCircle';

const PAGE_NAME = 'SectionItem';

const useStyles = makeStyles({
  sectionContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginRight: '4px',
    alignItems: 'center',
  },
  itemLabel: {
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      color: '#DADADA',
      cursor: 'pointer',
    },
  },
  disabledItemLabel: {
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  itemLabelToggle: {},
  sectionName: {
    marginLeft: '6px',
    marginRight: '10px',
  },
  checkbox: {
    width: '11px',
    height: '11px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  expandIcon: {
    fontSize: '14px',
    marginRight: '8px',
  },
});

function getSelectedCount(section) {
  const data = section.wells.filter(item => item.checked) || [];
  return data.length;
}

function getSelectedNumber(section) {
  const selectedCount = getSelectedCount(section);
  return selectedCount === section.wells.length
    ? `${selectedCount}`
    : `${selectedCount} of ${section.wells.length} Selected`;
}

function isSelected(section) {
  return section.wells.filter(item => item.checked).length > 0;
}

function isAllSelected(section) {
  return section.wells.filter(item => item.checked).length !== section.wells.length;
}

function SectionItem({ section, disabled, onExpandCollapse, onSelectAll, onClearAll }) {
  const classes = useStyles();
  const theme = useTheme();
  const handleClick = e => {
    e.stopPropagation();
    if (!isAllSelected(section) && onClearAll) onClearAll(section);
    if (isAllSelected(section) && onSelectAll) onSelectAll(section);
  };
  return (
    <div
      data-testid={`${PAGE_NAME}_section_${section.name}`}
      className={classes.sectionContainer}
    >
      <div
        className={disabled ? classes.disabledItemLabel : classes.itemLabel}
        onClick={() => onExpandCollapse && onExpandCollapse(section)}
      >
        <Tooltip title="No Wells" placement="right">
          <div className={classes.sectionTitle}>
            {disabled && <ExpandMore className={classes.expandIcon} />}
            <span className={classes.sectionName}> {section.name}</span>
          </div>
        </Tooltip>
        {getSelectedCount(section) > 0 && (
          <NumberCircle
            data-testid={`${PAGE_NAME}_wellsNumber`}
            bgColor={theme.palette.primary.text9}
            textColor="#fff"
            width={20 + (getSelectedNumber(section).length - 2) * 6}
          >
            {getSelectedNumber(section)}
          </NumberCircle>
        )}
      </div>

      {isSelected(section) ? (
        <Checkbox
          data-testid={`${PAGE_NAME}_checkbox`}
          className={classes.checkbox}
          size="small"
          checked
          indeterminate={isAllSelected(section)}
          color="primary"
          onClick={handleClick}
          disabled={disabled}
        />
      ) : (
        <Checkbox
          data-testid={`${PAGE_NAME}_checkbox`}
          className={classes.checkbox}
          checked={false}
          size="small"
          color="primary"
          onClick={handleClick}
          indeterminate={false}
          disabled={disabled}
        />
      )}
    </div>
  );
}

SectionItem.propTypes = {
  section: shape({
    expanded: bool,
    name: string,
    wells: arrayOf(shape({})),
  }).isRequired,
  disabled: bool,
  onExpandCollapse: func,
  onSelectAll: func,
  onClearAll: func,
};

SectionItem.defaultProps = {
  disabled: false,
  onSelectAll: null,
  onExpandCollapse: null,
  onClearAll: null,
};
// Important: Do not change root component default export (SectionItem.js). Use it as container
//  for your SectionItem. It's required to make build and zip scripts work as expected;
export default memo(SectionItem);
