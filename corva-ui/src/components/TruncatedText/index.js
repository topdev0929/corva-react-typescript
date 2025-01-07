import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Tooltip } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles({
  root: ({ maxLines }) => ({
    overflow: 'hidden',
    ...(maxLines
      ? { display: '-webkit-box', '-webkit-line-clamp': maxLines, '-webkit-box-orient': 'vertical' }
      : { whiteSpace: 'nowrap', textOverflow: 'ellipsis' }),
  }),
});

function TruncatedText({ children, className, maxLines, showTooltip, ...otherProps }) {
  const [hasTooltip, setHasTooltip] = useState(false);
  const contentRef = useRef();
  const styles = useStyles({ maxLines });

  useEffect(() => {
    const { scrollWidth, clientWidth, scrollHeight, clientHeight } = contentRef.current;
    setHasTooltip(maxLines ? scrollHeight > clientHeight : scrollWidth > clientWidth);
  });

  const content = (
    <div className={classNames(styles.root, className)} ref={contentRef} {...otherProps}>
      {children}
    </div>
  );

  if (!hasTooltip || !showTooltip) return content;
  return <Tooltip title={children}>{content}</Tooltip>;
}

TruncatedText.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  className: PropTypes.string,
  maxLines: PropTypes.number,
  showTooltip: PropTypes.bool,
};

TruncatedText.defaultProps = {
  className: '',
  maxLines: null,
  showTooltip: true,
};

export default TruncatedText;
