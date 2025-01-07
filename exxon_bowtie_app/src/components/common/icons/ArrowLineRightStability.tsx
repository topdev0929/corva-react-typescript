import { FC } from 'react';

import { ISvgIcon, SvgIcon } from './SvgIcon';

export const ArrowLineRightStability: FC<ISvgIcon> = ({ ...rest }) => {
  return (
    <SvgIcon
      width="265"
      height="217"
      viewBox="0 0 265 217"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle
        cx="3"
        cy="3"
        r="2"
        transform="matrix(1 0 0 -1 191 6.16992)"
        stroke="#BDBDBD"
        strokeWidth="2"
      />
      <path
        d="M6 214C76.5504 214 196.797 214 244.072 214C253.452 214 258.142 214 261.071 211.071C264 208.142 264 203.428 264 194L264 23C264 13.5719 264 8.85787 261.071 5.92894C258.142 3.00001 253.428 3.00001 244 3.00001L196.5 3.00001"
        stroke="#BDBDBD"
        strokeMiterlimit="16"
        strokeLinecap="square"
      />
      <path
        data-testid="arrow-line-right-stability-icon"
        d="M0.494334 213.622C0.164778 213.787 1.43173e-07 213.869 1.37209e-07 214C1.31245e-07 214.13 0.164778 214.212 0.494334 214.377L5.47641 216.867C5.67007 216.964 5.76689 217.012 5.83856 216.997C5.8991 216.985 5.95111 216.946 5.98087 216.892C6.01611 216.828 5.99831 216.721 5.96272 216.508C5.80519 215.563 5.72643 215.091 5.69552 214.616C5.66883 214.206 5.66883 213.794 5.69552 213.384C5.72643 212.909 5.80519 212.436 5.96272 211.492C5.99831 211.278 6.01611 211.172 5.98087 211.107C5.95111 211.053 5.8991 211.015 5.83856 211.002C5.76689 210.988 5.67007 211.036 5.47641 211.133L0.494334 213.622Z"
        fill={rest.color || '#BDBDBD'}
      />
    </SvgIcon>
  );
};
