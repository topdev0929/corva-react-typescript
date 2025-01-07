import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
 import { Menu, MenuItem, Checkbox, ListItemText } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { withStyles } from '@material-ui/core/styles';
import { isEqual } from 'lodash';

import { IconButton as IconButtonComponent } from '~/components';
import { METRICS_LIST, MAX_METRICS_COUNT } from '../../constants';

const muiStyles = {
  listItemPrimaryText: {
    color: '#fff',
    fontSize: '14px',
  },
  checkBox: {
    color: 'grey',
    padding: '5px',
  },
};

function MetricsAddMenu({ metricsKeys, onChange, classes, 'data-testid': dataTestId }) {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // NOTE: If there are >=2 columns, metrics keys can be duplicated
    setSelectedKeys(metricsKeys);
  }, [metricsKeys]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (!isEqual(selectedKeys, metricsKeys)) {
      onChange(selectedKeys);
    }
  };

  const handleChangeMetrics = newKey => {
    if (selectedKeys.includes(newKey)) {
      setSelectedKeys(prevKeys => prevKeys.filter(key => key !== newKey));
    } else {
      setSelectedKeys(prevKeys => prevKeys.concat(newKey));
    }
  };

  return (
    <>
      <IconButtonComponent
        data-testid={`${dataTestId}_addMetrics`}
        tooltipProps={{ title: 'Add Metric' }}
        size="small"
        onClick={handleClick}
      >
        <SettingsIcon size="small" />
      </IconButtonComponent>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            maxHeight: '300px',
            backgroundColor: '#414141',
          },
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {METRICS_LIST.map(item => (
          <MenuItem
            disabled={selectedKeys.length === MAX_METRICS_COUNT && !selectedKeys.includes(item.key)}
            key={item.key}
            onClick={() => handleChangeMetrics(item.key)}
          >
            <Checkbox
              data-testid={`${dataTestId}_checkbox_${item.key}`}
              checked={selectedKeys.includes(item.key)}
              className={classes.checkBox}
            />
            <ListItemText primary={item.label} classes={{ primary: classes.listItemPrimaryText }} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

MetricsAddMenu.propTypes = {
  metricsKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  'data-testid': PropTypes.string,
};

MetricsAddMenu.defaultProps = {
  'data-testid': 'MetricsSelect',
};

export default withStyles(muiStyles)(MetricsAddMenu);
