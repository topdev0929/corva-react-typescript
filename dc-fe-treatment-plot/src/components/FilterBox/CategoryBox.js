import { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, noop } from 'lodash';
import classNames from 'classnames';

import { Collapse, makeStyles } from '@material-ui/core';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@material-ui/icons';

import { LayoutContext } from '../../context/layoutContext';

import CategorySelect from './CategorySelect';
import CategoryChip from './CategoryChip';

const useStyles = makeStyles({
  listItem: {
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    '&:hover': {
      color: '#FFFFFF',
      '&>$listLabelContainer': {
        color: '#FFFFFF',
        '&>$arrowIcon': {
          color: '#FFFFFF',
        },
      },
    },
  },
  listLabelContainer: {
    display: 'flex',
    alignItems: 'center',
    color: '#BDBDBD',
    fontSize: '12px',
    lineHeight: '17px',
    whiteSpace: 'nowrap',
  },
  addButtonVisible: {
    visibility: 'unset',
  },
  addButtonHidden: {
    visibility: 'hidden',
  },
  arrowIcon: {
    marginRight: '8px',
  },
  seriesChip: {
    height: '32px',
    maxWidth: '100%',
    marginBottom: '8px',
  },
  disabled: {
    color: '#616161 !important',
    cursor: 'default',
  },
  chipsContainer: {
    '&.responsive': {
      display: 'flex',
      flexWrap: 'wrap',
      paddingLeft: 16,
    },
  },
});

function CategoryBox(props) {
  const {
    paramList,
    paramName,
    label,
    value = [],
    category,
    graphColors,
    showAddButtons,
    onChange,
  } = props;
  const { isResponsive } = useContext(LayoutContext);
  const [open, setOpen] = useState(true);
  const classes = useStyles();
  const isEmptySelected = isEmpty(value);

  return (
    <>
      <div
        className={classNames(classes.listItem, { [classes.disabled]: isEmptySelected })}
        onClick={
          isEmptySelected
            ? noop
            : () => {
                setOpen(!open);
              }
        }
      >
        <div
          className={classNames(classes.listLabelContainer, {
            [classes.disabled]: isEmptySelected && isEmpty(paramList),
          })}
        >
          {open && !isEmptySelected ? (
            <KeyboardArrowUpIcon
              className={classNames(classes.arrowIcon, { [classes.disabled]: isEmptySelected })}
              fontSize="small"
            />
          ) : (
            <KeyboardArrowDownIcon
              className={classNames(classes.arrowIcon, { [classes.disabled]: isEmptySelected })}
              fontSize="small"
            />
          )}
          {label}
        </div>
        <div
          className={classNames({
            [classes.addButtonVisible]: showAddButtons,
            [classes.addButtonHidden]: !showAddButtons,
          })}
        >
          <CategorySelect
            paramList={paramList}
            paramName={paramName}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={classNames(classes.chipsContainer, isResponsive && 'responsive')}>
          {value.map(seriesKey => (
            <CategoryChip
              graphColors={graphColors}
              key={seriesKey}
              category={category}
              paramList={paramList}
              seriesKey={seriesKey}
            />
          ))}
        </div>
      </Collapse>
    </>
  );
}

CategoryBox.propTypes = {
  paramList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  paramName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  graphColors: PropTypes.shape({}).isRequired,
  showAddButtons: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default memo(CategoryBox);
