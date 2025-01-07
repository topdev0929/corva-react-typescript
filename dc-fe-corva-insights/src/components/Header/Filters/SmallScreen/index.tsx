import { Button, Chip } from '@corva/ui/components';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core';

import { useFiltersStore } from '@/contexts/filters';
import { Theme } from '@/shared/types';
import filtersIcon from '@/assets/filters.svg';

import { FiltersContent } from '../Content';
import { FiltersPopover } from './Popover';
import styles from './index.module.css';
import { VIEWS } from '@/constants';

const useStyles = makeStyles<Theme>(theme => ({
  button: {
    backgroundColor: theme.palette.background.b7,
    color: theme.palette.primary.text1,
    '&:hover': {
      backgroundColor: theme.palette.background.b7,
    },
    '&:active': {
      backgroundColor: theme.palette.background.b8,
    },
  },
}));

export const SmallScreenVariant = observer(() => {
  const classes = useStyles();
  const store = useFiltersStore();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={styles.container}>
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<img src={filtersIcon} alt="Icon" />}
          className={classes.button}
          data-testid={`${VIEWS.HEADER}_filtersBtn`}
        >
          Filters
        </Button>
        {store.filtersAmount > 0 && (
          <Chip
            label={store.filtersAmount}
            onDelete={() => store.resetFilters()}
            data-testid={`${VIEWS.HEADER}_filtersChip`}
            deleteIcon={<CloseIcon />}
          />
        )}
      </div>
      <FiltersPopover
        anchorEl={anchorEl}
        onClose={handleClose}
        data-testid={`${VIEWS.HEADER}_filtersPopover`}
      >
        <div className={styles.popover}>
          <FiltersContent onRangeSet={handleClose} />
        </div>
      </FiltersPopover>
    </>
  );
});

SmallScreenVariant.displayName = 'Filters';
