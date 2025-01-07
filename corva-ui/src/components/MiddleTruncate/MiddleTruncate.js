import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getTruncatedText } from './utils';

function MiddleTruncate({ children, truncatedText, separator, maxWidth, onTruncate }) {
  const contentRef = useRef();

  useEffect(() => {
    const { scrollWidth, innerText } = contentRef.current;

    if (scrollWidth > maxWidth) {
      onTruncate(
        getTruncatedText({
          maxWidth,
          separator,
          text: children,
          currentWidth: scrollWidth,
          textLength: innerText?.length,
        })
      );
    } else {
      onTruncate(null);
    }
  }, [children]);

  return <div ref={contentRef}>{truncatedText || children}</div>;
}

MiddleTruncate.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  truncatedText: PropTypes.string,
  onTruncate: PropTypes.func,
  separator: PropTypes.string,
  maxWidth: PropTypes.number,
};

MiddleTruncate.defaultProps = {
  onTruncate: null,
  truncatedText: null,
  separator: ' ... ',
  maxWidth: null,
};

export default MiddleTruncate;
