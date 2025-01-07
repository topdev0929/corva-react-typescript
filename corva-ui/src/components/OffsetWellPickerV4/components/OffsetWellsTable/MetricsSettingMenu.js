import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { Menu, MenuItem, Checkbox, makeStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { IconButton } from '~/components';
import {
  METRICS_LIST,
  MAX_METRICS_COUNT,
  ViewType,
  IOS_DEVICE,
  DEFAULT_METRICS_KEY,
} from '../../constants';
import { getMobileOperatingSystem } from '../../utils';

const PAGE_NAME = 'MetricsSettingMenu';
const metricsList = METRICS_LIST.filter(metrics => metrics.key !== DEFAULT_METRICS_KEY);

const useStyles = makeStyles(theme => ({
  checkBox: {
    color: 'grey',
    padding: '0px',
    marginRight: '10px',
  },
  paper: {
    transform: 'translate(-40px, 4px) scale(1, 1) !important',
    maxHeight: 'calc(80% - 80px)',
    backgroundColor: theme.palette.background.b9,
  },
  paperMobile: {
    marginLeft: '8px',
    marginTop: '16px',
    maxHeight: 'calc(80% - 20px)',
  },
  paperiOSMobile: {
    marginLeft: '0px !important',
  },
  titleItem: {
    position: 'sticky',
    top: '0px',
    zIndex: 9,
    marginBottom: '-8px',
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    paddingLeft: '16px',
    background: theme.palette.background.b9,
  },
  titleLabel: {
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '14px',
    letterSpacing: '0.4px',
    color: '#999999',
  },
  menuList: {
    paddingTop: '0px !important',
  },
  menuItem: {
    height: '54px !important',
  },
}));

export const MetricsSettingMenu = ({ viewType, metricsKeys, onChange, contentRef }) => {
  const classes = useStyles();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setSelectedKeys(metricsKeys || []);
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
      setSelectedKeys(selectedKeys.filter(key => key !== newKey));
    } else {
      setSelectedKeys(selectedKeys.concat(newKey));
    }
  };

  return (
    <>
      <IconButton
        data-testid={`${PAGE_NAME}_gear`}
        size="small"
        tooltipProps={{ title: viewType !== ViewType.mobile ? 'Select Metrics' : '' }}
        onClick={handleClick}
      >
        <SettingsIcon />
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={contentRef.current}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        classes={{
          paper: classNames(classes.paper, {
            [classes.paperMobile]: viewType === ViewType.mobile,
            [classes.paperiOSMobile]: getMobileOperatingSystem() === IOS_DEVICE,
          }),
          list: classes.menuList,
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className={classes.titleItem}>
          <span className={classes.titleLabel}>Up to 2 Metrics</span>
        </div>
        {metricsList.map(item => (
          <MenuItem
            data-testid={`${PAGE_NAME}_option_${item.key}MenuItem`}
            className={classes.menuItem}
            disabled={selectedKeys.length === MAX_METRICS_COUNT && !selectedKeys.includes(item.key)}
            key={item.key}
            onClick={() => handleChangeMetrics(item.key)}
          >
            <Checkbox checked={selectedKeys.includes(item.key)} className={classes.checkBox} />
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

MetricsSettingMenu.propTypes = {
  viewType: PropTypes.string.isRequired,
  metricsKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  contentRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};
