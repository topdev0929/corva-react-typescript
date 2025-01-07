import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

const PAGE_NAME = 'confirmationDialog';

const muiStyles = {
  actionButton: { marginLeft: 15 },
  confirmation: { marginTop: 10 },
};

class ConfirmationDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmationTextField: '',
    };
  }

  get actions() {
    return (
      <>
        {this.props.isShowCancel && (
          <Button
            variant="text"
            data-testid={`${PAGE_NAME}_cancelButton`}
            className={this.props.classes.actionButton}
            onClick={this.props.handleClose}
            color="primary"
          >
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          data-testid={`${PAGE_NAME}_confirmButton`}
          className={this.props.classes.actionButton}
          onClick={this.props.handleOk}
          disabled={
            this.props.disableOk ||
            (this.props.confirmationText &&
              this.props.confirmation !== this.state.confirmationTextField)
          }
          color="primary"
        >
          {this.props.okText}
        </Button>
      </>
    );
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="confirmation-dialog-title"
        classes={{ paper: this.props.classes.paper }}
      >
        <DialogTitle id="confirmation-dialog-title">{this.props.title}</DialogTitle>

        <DialogContent>
          <DialogContentText>
            <Typography variant="body2" className={this.props.classes.content}>
              {this.props.text}
            </Typography>
            {this.props.confirmationText && (
              <TextField
                fullWidth
                data-testid={`${PAGE_NAME}_input`}
                label={this.props.confirmationText}
                value={this.state.confirmationTextField}
                onChange={e => this.setState({ confirmationTextField: e.target.value })}
                className={this.props.classes.confirmation}
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={this.props.classes.actions}>{this.actions}</DialogActions>
      </Dialog>
    );
  }
}

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  text: PropTypes.string.isRequired,
  confirmationText: PropTypes.string,
  confirmation: PropTypes.string,
  handleClose: PropTypes.func,
  handleOk: PropTypes.func,
  okText: PropTypes.string,
  disableOk: PropTypes.bool,
  isShowCancel: PropTypes.bool,

  classes: PropTypes.shape({}).isRequired,
};

ConfirmationDialog.defaultProps = {
  title: undefined,
  confirmationText: null,
  confirmation: '',
  okText: 'Ok',
  handleOk: () => undefined,
  handleClose: () => undefined,
  disableOk: false,
  isShowCancel: true,
};

export default withStyles(muiStyles)(ConfirmationDialog);
