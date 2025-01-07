import { FC } from 'react';

import { ArrowRight } from './icons/ArrowRight';
import { ArrowLeft } from './icons/ArrowLeft';

type ArrowIconProps = {
  direction: 'left' | 'right';
};

export const ArrowIcon: FC<ArrowIconProps> = ({ direction, ...props }) => {
  switch (direction) {
    case 'left':
      return <ArrowLeft {...props} />;
    case 'right':
      return <ArrowRight {...props} />;
    default:
      return null;
  }
};
