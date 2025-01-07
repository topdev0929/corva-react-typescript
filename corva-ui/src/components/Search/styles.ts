import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette }) => ({
  searchInput: {
    '& .MuiAutocomplete-input': {
      padding: '5px !important',
    },
    '&::before': {
      borderColor: palette.primary.text9,
    },
    '&:hover .MuiInputAdornment-root svg': {
      fill: `${palette.primary.contrastText} !important`,
    },
    '&:hover .MuiInput-underline:not(.Mui-disabled):before': {
      borderBottom: `2px solid ${palette.primary.contrastText} !important`,
    },
    '& .Mui-focused .MuiInputAdornment-positionStart svg.MuiSvgIcon-root': {
      fill: `${palette.primary.main} !important`,
    },
  },
  popper: {
    top: '8px !important',
  },
  popupIndicator: {
    color: palette.primary.text6,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  popupIndicatorOpen: {
    color: palette.primary.main,
  },
  label: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
    fontWeight: 400,
  },
  listbox: {
    maxHeight: 160,
    position: 'relative',
  },
  textField: { paddingRight: '0px !important', paddingBottom: '0px !important' },
  searchIcon: {
    fill: `${palette.primary.text6} !important`,
    width: '24px',
    height: '24px',
  },
  closeIcon: {
    fill: `${palette.primary.text6} !important`,
    '&:hover': {
      fill: `${palette.primary.contrastText} !important`,
    },
  },
  iconButton: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  option: {
    '&.large': { padding: '9px 0' },
  },
  group: {
    padding: '4px 0',
  },
  groupChip: {
    margin: '0 16px 4px',
    color: palette.primary.text6,
    border: `1px solid ${palette.primary.text9}`,
    fontSize: 14,
    '&:hover': {
      backgroundColor: 'initial',
    },
  },
  selectedGroup: {
    padding: '4px 2px',
    marginRight: 8,
    color: palette.primary.text6,
    border: `1px solid ${palette.primary.text9}`,
    height: 20,
    fontSize: 14,

    '& .MuiChip-label': {
      padding: '0px 0px 0px 8px',
    },
  },
  selectedGroupLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: '16px',
    margin: '0 4px',
    cursor: 'pointer',
  },
  removeIconWithDropdown: {
    marginRight: 20,
    zIndex: 1,
  },
  checkbox: {
    padding: '0 8px 0 0',
    '&:hover': {
      backgroundColor: 'initial !important',
    },
  },
  selectAllCheckbox: {
    margin: 0,
    padding: '8px 0',
    height: 54,
    width: '100%',
    borderBottom: `1px solid ${palette.primary.text9}`,
    '& .MuiCheckbox-root .MuiSvgIcon-root': {
      fontSize: '20px !important',
    },
    '& .Mui-checked': {
      padding: '0 8px 0 16px',
    },
    '& .Mui-checked:hover': {
      backgroundColor: 'initial !important',
    },
    '& .Mui-checked:active': {
      backgroundColor: 'initial !important',
    },
  },
  selectedLabel: {
    padding: '0 4px',
  },
  menuItem: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'initial',
    },
  },
}));

export default useStyles;
