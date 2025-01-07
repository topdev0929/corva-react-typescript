import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles, MenuItem, Chip, Tooltip, Checkbox } from '@material-ui/core';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@material-ui/icons';
import { ACTIVE_STATUS } from '../constants';
import MiddleTruncate from '~/components/MiddleTruncate';

const useStyles = makeStyles({
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: 36,
    paddingBottom: 0,
    paddingTop: 0,
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeChip: {
    fontWeight: 500,
    backgroundColor: '#75DB29',
    color: '#212121',
    fontSize: 10,
    cursor: 'pointer',
    height: 12,
    textTransform: 'uppercase',
    marginRight: 12,
    letterSpacing: 1,
  },
});

const SelectItem = ({
  'data-testid': PAGE_NAME,
  value,
  className,
  assetName,
  status,
  multiple,
  selected,
  ...restProps
}) => {
  const [truncatedText, setTruncatedText] = useState(null);
  const isTruncated = !!truncatedText;
  const styles = useStyles();

  const handleTruncatedText = truncatedText => {
    setTruncatedText(truncatedText);
  };

  const itemContent = (
    <div className={styles.itemContent}>
      <MiddleTruncate onTruncate={handleTruncatedText} truncatedText={truncatedText} maxWidth={380}>
        {assetName}
      </MiddleTruncate>
      {status === ACTIVE_STATUS && (
        <Chip data-not-migrated-muichip className={styles.activeChip} label="Active" />
      )}
    </div>
  );

  return (
    <Tooltip title={isTruncated ? assetName : ''}>
      {multiple ? (
        <div className={classNames(styles.option)}>
          <Checkbox
            disableRipple
            icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
            className={styles.checkbox}
            checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}
            checked={selected}
          />
          {itemContent}
        </div>
      ) : (
        <MenuItem
          data-testid={PAGE_NAME}
          value={value}
          className={classNames(styles.menuItem, className)}
          {...restProps}
        >
          {itemContent}
        </MenuItem>
      )}
    </Tooltip>
  );
};

SelectItem.propTypes = {
  'data-testid': PropTypes.string,
};

SelectItem.defaultProps = {
  'data-testid': 'MenuItem',
};

export default SelectItem;
