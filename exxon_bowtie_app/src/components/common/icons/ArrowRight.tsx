import { FC } from 'react';

import { ISvgIcon, SvgIcon } from './SvgIcon';

export const ArrowRight: FC<ISvgIcon> = ({ ...rest }) => (
  <SvgIcon width={6} height={6} {...rest}>
    <path
      data-testid="arrow-right-icon"
      d="M6.30572 3.37742C6.63527 3.21274 6.80005 3.13039 6.80005 3C6.80005 2.8696 6.63527 2.78726 6.30572 2.62258L1.32364 0.132979C1.12998 0.0362085 1.03316 -0.0121766 0.961487 0.00262466C0.900948 0.015127 0.848935 0.0535212 0.819175 0.107673C0.783942 0.171782 0.801739 0.278502 0.837333 0.491942C0.994857 1.43654 1.07362 1.90884 1.10453 2.38399C1.13122 2.79423 1.13122 3.20577 1.10453 3.616C1.07362 4.09116 0.994857 4.56346 0.837333 5.50806C0.801739 5.7215 0.783942 5.82822 0.819175 5.89233C0.848935 5.94648 0.900948 5.98487 0.961487 5.99737C1.03316 6.01218 1.12998 5.96379 1.32364 5.86702L6.30572 3.37742Z"
      fill={rest.color || '#9E9E9E'}
    />
  </SvgIcon>
);
