import { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, ListItem, Typography, Checkbox } from '@material-ui/core';

const PAGE_NAME = 'WellListItem';

const useStyles = makeStyles(theme => ({
  wellListItem: {
    display: 'flex',
    padding: '0',
    justifyContent: 'space-between',
    width: '100%',
    height: '32px',
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.03)',
    },
    '&:first-child': {
      marginTop: '16px',
    },
    '&:last-child': {
      marginBottom: '8px',
    },
    },
  wellListItemName: {
    marginLeft: '30px',
    width: 'calc(75%)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    color: theme.palette.primary.text1,
  },
  manualItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
  },
  manualItemIcon: {
    fontSize: '16px',
  },
  manualItemLabel: {
    marginLeft: '8px',
    color: theme.palette.primary.text6,
    '&:hover': {
      color: theme.palette.primary.text1,
      cursor: 'pointer',
    },
  },
  wellListItemcheckbox: {
    width: '13px',
    height: '13px',
    marginRight: '4px',
  },
}));

function WellListItem({ well, wellName, rigName, onToggleWell }) {
  const classes = useStyles();

  return (
    <>
      <ListItem data-testid={`${PAGE_NAME}_well_${wellName}`} className={classes.wellListItem}>
        <Typography className={classes.wellListItemName}>{`${wellName} (${rigName})`}</Typography>
        <Checkbox
          data-testid={`${PAGE_NAME}_checkbox`}
          className={classes.wellListItemcheckbox}
          size="small"
          checked={well.checked}
          color="primary"
          onClick={() => onToggleWell(well)}
        />
      </ListItem>
    </>
  );
}

WellListItem.propTypes = {
  well: PropTypes.shape({
    id: PropTypes.number,
    checked: PropTypes.bool,
  }).isRequired,
  wellName: PropTypes.string.isRequired,
  rigName: PropTypes.string.isRequired,
  onToggleWell: PropTypes.func.isRequired,
};

// Important: Do not change root component default export (WellListItem.js). Use it as container
//  for your WellListItem. It's required to make build and zip scripts work as expected;
export default memo(WellListItem);
