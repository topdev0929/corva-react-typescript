import { Checkbox, makeStyles, withStyles } from '@material-ui/core';

import { Theme } from '@/shared/types';

export const StyledCheckbox = withStyles({ root: { paddingLeft: '7px' } })(Checkbox);

export const useStyles = makeStyles<Theme>(theme => ({
  formControl: {
    width: '100%',
  },
  paper: {
    maxWidth: 250,
    maxHeight: 500,
  },
  item: {
    paddingLeft: 8,
    color: theme.palette.primary.text1,
  },
  itemText: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '& > *': {
      display: 'inline',
    },
  },
  itemSuffix: {
    fontSize: 12,
    color: theme.palette.primary.text6,
  },
  multipleValueSelect: {
    borderRadius: '4px',
    paddingLeft: '0px',
    marginRight: '8px',
  },
  multipleValueSelectLabel: {
    fontSize: '14px',
    color: theme.palette.primary.text6,
    borderRadius: '4px !important',
  },
  multipleValueSelectIcon: {
    top: 'calc(100% - 29px)',
  },
}));
