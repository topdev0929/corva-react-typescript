import { number, shape, string, node } from 'prop-types';

import styles from './style.css';

const VideoElement = ({ attributes, element, children }) => {
  const { url, width } = element;
  if (!url) return null;

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <div className={styles.videoContainer}>
          <iframe
            className={styles.player}
            style={{
              width: `${width ? `${width}px` : '100%'}`,
              height: `${width ? `calc(${width}px/1.77)` : '100%'}`,
            }}
            src={url}
            frameBorder="0"
            allowFullScreen
            title="video"
          />
        </div>
      </div>
      {children}
    </div>
  );
};

VideoElement.propTypes = {
  element: shape({ url: string.isRequired, width: number.isRequired }).isRequired,
  attributes: shape({}).isRequired,
  children: node.isRequired,
};

export default VideoElement;
