import { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import BackIcon from '@material-ui/icons/ArrowBack';

import LoadingIndicator from '~components/LoadingIndicator';

import styles from './styles.css';

const REQUEST_TIMEOUT = 10000;
const BYTES_IN_MEGABYTE = 1048576;

const Toolbar = props => (
  <div className={styles.cGoogleDocsViewerToolbar}>
    <button
      type="button"
      aria-label="Close"
      className={styles.cGoogleDocsViewerToolbarButton}
      onClick={props.onClose}
    >
      <div className={styles.cGoogleDocsViewerToolbarBackButton}>
        <BackIcon className={styles.cGoogleDocsViewerToolbarIcon} htmlColor="#b3b3b3" />
        {props.fileName && (
          <span className={styles.cGoogleDocsViewerToolbarBackButtonFileName}>
            {props.fileName}
          </span>
        )}
      </div>
    </button>
  </div>
);

class GoogleDocsViewer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      reloadsCounter: 0,
      loading: true,
      loadingFailed: false,
    };

    this.frameRef = createRef();
  }

  componentDidMount() {
    // NOTE: Workaround when google viewer returns 204:
    // https://productforums.google.com/forum/#!msg/docs/hmj39HMDP1M/X6a8xJwLBQAJ

    const timeOut =
      this.props.fileSize && this.props.fileSize >= BYTES_IN_MEGABYTE
        ? (this.props.fileSize / BYTES_IN_MEGABYTE) * REQUEST_TIMEOUT
        : REQUEST_TIMEOUT;

    this.frameLoadInterval = setInterval(this.reloadFrame, timeOut);
  }

  componentWillUnmount() {
    clearInterval(this.frameLoadInterval);
  }

  get frameLink() {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(
      this.props.fileUrl
    )}&embedded=true`;
  }

  reloadFrame = () => {
    if (this.frameRef.current) {
      this.setState(
        prevState => ({ reloadsCounter: prevState.reloadsCounter + 1 }),
        () => {
          this.frameRef.current.src = this.frameLink;
        }
      );
    }
  };

  onFrameLoad = () => {
    this.setState({ loading: false }, () => {
      clearInterval(this.frameLoadInterval);
    });
  };

  render() {
    const { fileUrl, width, height, fileName, onClose } = this.props;
    const { loading, loadingFailed } = this.state;

    return (
      <div className={styles.cGoogleDocsViewer} style={{ width, height }}>
        <Toolbar fileName={fileName} onClose={onClose} />
        {loading && <LoadingIndicator white={false} />}
        {loadingFailed ? (
          <Typography variant="body2">Loading failed</Typography>
        ) : (
          <iframe
            className={classNames(styles.cGoogleDocsViewerFrame, {
              [styles.cGoogleDocsViewerFrameHidden]: loading,
            })}
            title={fileUrl}
            src={this.frameLink}
            onLoad={this.onFrameLoad}
            ref={this.frameRef}
          />
        )}
      </div>
    );
  }
}

GoogleDocsViewer.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fileUrl: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  fileSize: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

Toolbar.propTypes = {
  onClose: PropTypes.func.isRequired,
  fileName: PropTypes.string,
};

GoogleDocsViewer.defaultProps = {
  width: '100%',
  height: '100%',
  fileName: undefined,

  fileSize: undefined,
};

Toolbar.defaultProps = {
  fileName: undefined,
};

export default GoogleDocsViewer;
