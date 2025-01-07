import { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Close as CloseIcon, ArrowBackIos as BackIcon } from '@material-ui/icons';

import { COMPONENT_FAMILIES } from '~/constants/casing';

import { Editor as DrillPipeEditor } from './DrillPipe';
import { Editor as ComponentEditor } from './CasingJoints';

const useStyles = makeStyles(theme => ({
  paper: {
    background: theme.isLightTheme ? theme.palette.primary.text1 : theme.palette.background.b5,
  },
  dialogTitle: {
    padding: '12px 0',
    borderBottom: `1px solid ${theme.palette.background.b7}`,
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 400,
  },
  closeIcon: {
    color: theme.palette.primary.text6,
    '&:hover': {
      color: theme.palette.primary.text1,
    },
  },
  dialogContent: {
    padding: '0px 0px 0px 16px',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  dialogActions: {
    padding: '8px 16px',
    justifyContent: 'space-between',
  },
  contentView: {
    display: 'flex',
    height: '100%',
  },
  componentListView: {
    height: '100%',
    flex: 1,
    overflowY: 'auto',
    paddingRight: '16px',
  },
  bottomGradient: {
    position: 'absolute',
    height: '16px',
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(180deg, rgba(33, 33, 33, 0) 0%, ${theme.palette.background.b5} 100%)`,
  },
}));

function EditComponentDialog({
  component,
  isDraft,
  error,
  onChange,
  onUseSuggestion,
  onCancel,
  onSave,
  onClose,
}) {
  const tempComponentProps = {
    component,
    isDraft,
    error,
    onChange,
    onUseSuggestion,
    onCancel,
    onSave,
  };
  const classes = useStyles();
  const { family } = component;

  const getComponentName = type => {
    if (!type) return '—';
    const matchedItem = COMPONENT_FAMILIES.find(item => item.type === type);
    return matchedItem?.name || type.toUpperCase();
  };

  return (
    <Dialog
      open
      onBackdropClick={onClose}
      onEscapeKeyDown={onClose}
      maxWidth="xs"
      fullWidth
      fullScreen
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        <div className={classes.titleWrapper}>
          <Typography className={classes.title}>{getComponentName(family)}</Typography>
          <CloseIcon onClick={onClose} className={classes.closeIcon} />
        </div>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <div className={classes.contentView}>
          <div className={classes.componentListView}>
            {(family === 'dp' || family === 'hwdp') && (
              <DrillPipeEditor {...tempComponentProps} isMobile />
            )}
            {family !== 'dp' && family !== 'hwdp' && (
              <ComponentEditor {...tempComponentProps} isMobile />
            )}
          </div>
          <div className={classes.bottomGradient} />
        </div>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button startIcon={<BackIcon />} onClick={onClose} />
        <div>
          <Button color="primary" style={{ marginRight: '12px' }} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onSave}>
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

EditComponentDialog.propTypes = {
  component: PropTypes.shape({ family: PropTypes.string }).isRequired,
  isDraft: PropTypes.bool.isRequired,
  error: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  onUseSuggestion: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default memo(EditComponentDialog);
