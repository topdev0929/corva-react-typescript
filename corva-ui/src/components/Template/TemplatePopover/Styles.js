import { makeStyles } from '@material-ui/core';

export const useTemplatePopoverStyles = makeStyles(theme => ({
  paper: {
    background: '#414141',
    color: theme.palette.text.primary,
    width: '360px',
    minHeight: '520px',
    padding: '24px 16px',
    marginLeft: theme.spacing(1),
  },
  paperWrapper: {
    width: '100%',
    height: '100%',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'baseline',
  },
  title: {
    fontSize: '20px',
    lineHeight: '23px',
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  templateHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: '10px',
    color: '#9E9E9E',
    lineHeight: '12px',
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: '0.4px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  selectedGroup: {
    display: 'flex',
    width: 'calc(100% + 32px)',
    height: '48px',
    marginLeft: '-16px',
    cursor: 'pointer',
  },
  selectedGroupUnSelected: {
    '&:hover': {
      backgroundColor: 'rgb(75, 75, 75)',
    },
  },
  selectedGroupSelected: {
    backgroundColor: 'rgb(84, 84, 84)',
  },
  noTemplateItem: {
    display: 'flex',
    marginLeft: '16px',
  },
  selectedIcon: {
    marginRight: '8px',
    height: '100%',
  },
  selectedLabel: {
    width: '100%',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '48px',
    color: '#FFFFFF',
  },
  noTemplateLabel: {
    left: '40px',
    top: 'calc(50% - 10px)',
    fontSize: '16px',
    lineHeight: '140.6%',
    color: '#808080',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  templateList: {
    padding: 0,
    marginLeft: '-16px',
    width: 'calc(100% + 32px)',
  },
  templateListItem: {
    position: 'relative',
    padding: '0 16px',
    height: '48px',
    cursor: 'pointer',
  },
  templateListItemUnSelected: {
    '&:hover': {
      backgroundColor: 'rgb(75, 75, 75)',
    },
    '&:hover $actionWrapper': {
      backgroundColor: 'rgb(75, 75, 75)',
      visibility: 'visible',
    },
  },
  templateListItemSelected: {
    backgroundColor: 'rgb(84, 84, 84)',
    '&:hover $actionWrapper': {
      backgroundColor: 'rgb(84, 84, 84)',
      visibility: 'visible',
    },
  },
  templateListItemName: {
    marginLeft: theme.spacing(1),
    maxWidth: '160px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  templateListItemInput: {
    marginLeft: theme.spacing(1),
    width: '225px',
  },
  actionWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    marginRight: '16px',
    visibility: 'hidden',
  },
  actionWrapperEditing: {
    visibility: 'visible',
  },
  actionWrapperHidden: {
    visibility: 'hidden !important',
  },
  actionIconButton: {
    padding: '6px',
    '&:hover': {
      backgroundColor: '#333333',
    },
    '&:hover $actionIcon': {
      color: '#fff',
    },
  },
  actionIcon: {
    color: '#DADADA',
    fontSize: '20px',
  },
  addNewTemplateIcon: {
    marginLeft: '10px',
    fontSize: '20px',
    cursor: 'pointer',
    '&:hover': {
      color: '#008BA3',
    },
  },
}));
