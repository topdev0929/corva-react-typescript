import { FC } from 'react';

import { ISvgIcon, SvgIcon } from './SvgIcon';

export const CheckIcon: FC<ISvgIcon> = ({ ...rest }) => (
  <SvgIcon
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      data-testid="check-icon"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.5303 6.46967C20.8232 6.76256 20.8232 7.23744 20.5303 7.53033L10.5303 17.5303C10.2374 17.8232 9.76256 17.8232 9.46967 17.5303L4.46967 12.5303C4.17678 12.2374 4.17678 11.7626 4.46967 11.4697C4.76256 11.1768 5.23744 11.1768 5.53033 11.4697L10 15.9393L19.4697 6.46967C19.7626 6.17678 20.2374 6.17678 20.5303 6.46967Z"
      fill={rest.color || '#03BCD4'}
    />
  </SvgIcon>
);
