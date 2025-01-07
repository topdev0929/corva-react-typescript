import { FC } from 'react';

import { ISvgIcon, SvgIcon } from './SvgIcon';

export const RectIcon: FC<ISvgIcon> = ({ ...rest }) => (
  <SvgIcon width={12} height={12} {...rest}>
    <rect
      data-testid="rect-icon"
      x="0.5"
      y="0.5"
      width="11"
      height="11"
      rx="1.5"
      fill={rest.color || '#D32F2F'}
      fillOpacity="0.3"
      stroke={rest.stroke || '#F44336'}
      strokeDasharray="2 2"
    />
  </SvgIcon>
);
