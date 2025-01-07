import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const muiStyles = {
  paperBase: { backgroundColor: 'transparent', position: 'relative' },
  // NOTE: With all margins and paddings it equals to 60 px for one-line feed item comment
  paperRoot: { marginBottom: 8 },
  // NOTE: With all margins and paddings it equals to 70 px for one-line alert item comment
  paperRootSpaceAround: { margin: '5px 0 10px', padding: 11 },
  // NOTE: Makes CommentLoader have the same height as one-line Comment
  paperRootLoader: { margin: '5px 0', minHeight: 60 },
  // NOTE: Makes CommentLoader have the same height as one-line Comment with space around
  paperRootLoaderSpaceAround: { margin: '5px 0 10px', padding: '4px 0 6px' },
};

const getPaperRoot = (classes, spaceAround, isLoader) => {
  if (isLoader && spaceAround) {
    return classes.paperRootLoaderSpaceAround;
  } else if (isLoader && !spaceAround) {
    return classes.paperRootLoader;
  } else if (!isLoader && spaceAround) {
    return classes.paperRootSpaceAround;
  } else if (!isLoader && !spaceAround) {
    return classes.paperRoot;
  }

  return null;
};

const CommentWrapper = ({ spaceAround, isLoader, children, classes, className }) => (
  <Paper
    className={classNames(
      getPaperRoot(classes, spaceAround, isLoader),
      classes.paperBase,
      className
    )}
    elevation={0}
  >
    {children}
  </Paper>
);

CommentWrapper.propTypes = {
  spaceAround: PropTypes.bool,
  isLoader: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,

  classes: PropTypes.shape({}).isRequired,
};

CommentWrapper.defaultProps = {
  spaceAround: false,
  isLoader: false,
  className: undefined,
};

export default withStyles(muiStyles)(CommentWrapper);
