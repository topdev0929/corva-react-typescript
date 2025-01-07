import { ReactNode, useRef, useState } from 'react';
import classNames from 'classnames';
import * as images from './images';
import useResizeObserver from '~/effects/useResizeObserver';

import { SIZES, APP_MESSAGES } from './constants';
import { getSize } from './utils';
import { useStyles } from './styles';

export interface EmptyStateProps {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  image?: string;
  classes?: {
    root?: string;
    content?: string;
    title?: string;
    subtitle?: string;
    image?: string;
  };
  'data-testid'?: string;
}

function EmptyState({
  title,
  subtitle,
  image,
  classes,
  'data-testid': PAGE_NAME,
}: EmptyStateProps): JSX.Element {
  const [size, setSize] = useState(SIZES.LARGE);
  const containerRef = useRef();

  const resizeObserverCallback = ([entry]) => {
    const { blockSize: height } = entry.borderBoxSize[0];
    setSize(getSize(height));
  };
  useResizeObserver({ callback: resizeObserverCallback, containerRef });

  const styles = useStyles({ image, size });
  const hasImage = size !== SIZES.SMALL;

  return (
    <div className={classNames(styles.root, classes.root)}>
      <div
        data-testid={`${PAGE_NAME}_fullMessage`}
        className={classNames(styles.content, classes.content)}
        ref={containerRef}
      >
        <div data-testid={`${PAGE_NAME}_title`} className={classNames(styles.title, classes.title)}>
          {title}
        </div>
        <div
          data-testid={`${PAGE_NAME}_subtitle`}
          className={classNames(styles.subtitle, classes.subtitle)}
        >
          {subtitle}
        </div>
        {hasImage && <img src={image} className={styles.image} alt="error" />}
      </div>
    </div>
  );
}

EmptyState.defaultProps = {
  title: 'No Data Available',
  subtitle: '',
  image: images.NoDataAvailable,
  classes: {},
  'data-testid': 'EmptyState',
};

EmptyState.IMAGES = images;
EmptyState.APP_MESSAGES = APP_MESSAGES;

export default EmptyState;
