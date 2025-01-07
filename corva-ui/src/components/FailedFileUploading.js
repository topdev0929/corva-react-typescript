import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import WarningIcon from '@material-ui/icons/Warning';

const muiStyles = {
  errorIcon: {
    marginRight: 8,
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    marginTop: 8,
  },
};

const FailedFileUploading = props => (
  <Typography variant="body1" className={classNames(props.className, props.classes.errorMessage)}>
    <WarningIcon color="error" className={props.classes.errorIcon} />
    <span>Upload failed. {props.errorMessage}</span>
  </Typography>
);

FailedFileUploading.propTypes = {
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.shape({}).isRequired,
};

FailedFileUploading.defaultProps = {
  errorMessage: undefined,
  className: undefined,
};

export default withStyles(muiStyles)(FailedFileUploading);
