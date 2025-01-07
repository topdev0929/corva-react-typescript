import PropTypes from 'prop-types';
import { last } from 'lodash';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core';

import XmlFileIcon from '~/assets/xml.svg';
import TxtFileIcon from '~/assets/txt.svg';
import CsvFileIcon from '~/assets/csv.svg';
import UnknownFileIcon from '~/assets/unknown.svg';
import WarningIcon from '~/assets/warning.svg';
import WaitingIcon from '~/assets/waiting.svg';

const useStyles = makeStyles({
  svgIcon: {
    minWidth: '24px',
    width: '24px',
    height: '24px',
    marginRight: '12px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
  },
  warningIcon: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
  },
  waitingIcon: {
    width: '24px',
    height: '24px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    animation: '$rotation 1.4s infinite linear',
  },
  '@keyframes rotation': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(359deg)',
    },
  },
});

function getFileExtension(fileName) {
  return last((last((fileName || '').split('/')) || '').split('.'));
}

const EXTENSION_ICON_MAPPING = {
  xml: XmlFileIcon,
  txt: TxtFileIcon,
  csv: CsvFileIcon,
};

function FileIcon({ fileName, error, waiting }) {
  const classes = useStyles();
  const extension = getFileExtension(fileName);

  if (waiting) {
    return (
      <div
        className={classnames(classes.svgIcon, classes.waitingIcon)}
        style={{ backgroundImage: `url("${WaitingIcon}")` }}
      />
    );
  }

  if (error) {
    return (
      <div
        className={classnames(classes.svgIcon, classes.warningIcon)}
        style={{ backgroundImage: `url("${WarningIcon}")` }}
      />
    );
  }

  if (Object.keys(EXTENSION_ICON_MAPPING).includes(extension)) {
    return (
      <div
        className={classes.svgIcon}
        style={{ backgroundImage: `url("${EXTENSION_ICON_MAPPING[extension]}")` }}
      />
    );
  }

  return (
    <div className={classes.svgIcon} style={{ backgroundImage: `url("${UnknownFileIcon}")` }} />
  );
}

FileIcon.propTypes = {
  fileName: PropTypes.string.isRequired,
  error: PropTypes.bool,
  waiting: PropTypes.bool,
};

FileIcon.defaultProps = {
  error: false,
  waiting: false,
};

export default FileIcon;
