import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';

import OpenFolderIcon from './OpenFolderIcon';
import ClosedFolderIcon from './ClosedFolderIcon';

const useStyles = makeStyles({
  folderIcon: {
    width: 16,
    height: 16,
    display: 'flex',
    alignItems: 'flex-end',
  },
  iconColor: ({color}) => {
    return {
      '& svg': {
        fill: color,
      },
    };
  },
});

const FolderIcon = ({ className, isOpen, color }) => {
  const classes = useStyles({color});

  const Icon = isOpen ? OpenFolderIcon : ClosedFolderIcon;

  return (
    <div className={classNames(classes.folderIcon, classes.iconColor, className)}>
      <Icon />
    </div>
  );
};

FolderIcon.propTypes = {
  isOpen: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string.isRequired,
};

FolderIcon.defaultProps = {
  isOpen: false,
  className: '',
};

export default FolderIcon;
