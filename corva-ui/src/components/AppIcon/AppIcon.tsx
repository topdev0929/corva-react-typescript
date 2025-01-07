import classNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core';

import { getAppIcon, getIconComponentBySegment } from './utils';

const useStyles = makeStyles<Theme, { radius: number }>(() => ({
  icon: {
    borderRadius: ({ radius }) => radius,
  },
}));

type AppIconProps = {
  alt?: string;
  appDevType?: 'ui' | 'be';
  className?: string;
  'data-testid'?: string;
  height?: number;
  iconUrl?: string;
  radius?: number;
  segment?: string[];
  width?: number;
};

export const AppIcon = ({
  alt = 'app icon',
  appDevType = 'ui',
  className,
  'data-testid': PAGE_NAME = '',
  height = 16,
  iconUrl = null,
  radius = 10,
  segment,
  width = 16,
}: AppIconProps) => {
  const styles = useStyles({ radius });

  const SegmentIcon = getIconComponentBySegment(segment, appDevType);
  const iconLocator = `AppIcon_${PAGE_NAME}_${iconUrl || ''}`;

  const handleImageError = ({ target }) => {
    // eslint-disable-next-line no-param-reassign
    target.src = getAppIcon(segment, appDevType);
  };

  return iconUrl ? (
    <img
      alt={alt}
      className={classNames(styles.icon, className)}
      data-testid={iconLocator}
      height={height}
      onError={handleImageError}
      src={iconUrl}
      width={width}
    />
  ) : (
    <SegmentIcon data-testid={iconLocator} className={className} width={width} height={height} />
  );
};
