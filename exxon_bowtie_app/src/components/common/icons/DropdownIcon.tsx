import { FC } from 'react';

import { ISvgIcon, SvgIcon } from './SvgIcon';

export const DropdownIcon: FC<ISvgIcon> = ({ ...rest }) => (
  <SvgIcon
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      data-testid="dropdown-icon"
      d="M11.06 5.72668L8 8.78002L4.94 5.72668L4 6.66668L8 10.6667L12 6.66668L11.06 5.72668Z"
      fill={rest.color || '#BDBDBD'}
    />
  </SvgIcon>
);
