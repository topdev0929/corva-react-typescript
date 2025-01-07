import { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import LoadingIndicator from '~components/LoadingIndicator';
import CommentWrapper from '~components/CommentWrapper';

const styles = {
  // NOTE: Centers the LoadingIndicator
  loadingIndicatorWrapper: { padding: '0 20px 0 0' },
};

const muiStyles = {
  commentWrapper: {
    width: 'calc(100% - 28px)', // NOTE: 28 === settings icon size.
  },
};

class CommentLoader extends PureComponent {
  constructor(props) {
    super(props);

    this.commentLoaderEl = createRef();
  }

  componentDidMount() {
    if (this.props.showOnMount) {
      this.showIntoView();
    }
  }

  showIntoView = () => {
    this.commentLoaderEl.current.scrollIntoView({ block: 'end' });
  };

  render() {
    return (
      <div ref={this.commentLoaderEl}>
        <CommentWrapper
          spaceAround={this.props.spaceAround}
          isLoader
          className={this.props.classes.commentWrapper}
        >
          <div style={styles.loadingIndicatorWrapper}>
            <LoadingIndicator fullscreen={false} size={30} />
          </div>
        </CommentWrapper>
      </div>
    );
  }
}

CommentLoader.propTypes = {
  showOnMount: PropTypes.bool,
  spaceAround: PropTypes.bool,

  classes: PropTypes.shape({}).isRequired
};

CommentLoader.defaultProps = {
  showOnMount: false,
  spaceAround: false,
};

export default withStyles(muiStyles)(CommentLoader);
