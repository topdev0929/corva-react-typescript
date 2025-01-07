import { FC } from 'react';

import { ISvgIcon, SvgIcon } from './SvgIcon';

export const One2ThreeSeafloor: FC<ISvgIcon> = ({ ...rest }) => (
  <SvgIcon
    width="58"
    height="178"
    viewBox="0 0 58 178"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      data-testid="one-to-three-seafloor-icon"
      d="M57.5057 91.3774C57.8352 91.2127 58 91.1304 58 91C58 90.8696 57.8352 90.7873 57.5057 90.6226L52.5236 88.133C52.3299 88.0362 52.2331 87.9878 52.1614 88.0026C52.1009 88.0151 52.0489 88.0535 52.0191 88.1077C51.9839 88.1718 52.0017 88.2785 52.0373 88.4919C52.1948 89.4365 52.2736 89.9088 52.3045 90.384C52.3312 90.7942 52.3312 91.2058 52.3045 91.616C52.2736 92.0912 52.1948 92.5635 52.0373 93.5081C52.0017 93.7215 51.9839 93.8282 52.0191 93.8923C52.0489 93.9465 52.1009 93.9849 52.1614 93.9974C52.2331 94.0122 52.3299 93.9638 52.5236 93.867L57.5057 91.3774Z"
      fill={rest.color || '#BDBDBD'}
    />
    <path d="M6 91H52" stroke="#BDBDBD" strokeLinecap="square" />
    <path
      d="M5.75 3C7.38808 3 9.16795 3 10.9991 3C20.4278 3 25.1421 3 28.0711 5.92893C31 8.85786 31 13.5719 31 23L31 86"
      stroke="#BDBDBD"
      strokeMiterlimit="16"
      strokeLinecap="square"
    />
    <path
      d="M5.75 175C7.38808 175 9.16796 175 10.9991 175C20.4278 175 25.1421 175 28.0711 172.071C31 169.142 31 164.428 31 155L31 87"
      stroke="#BDBDBD"
      strokeMiterlimit="16"
      strokeLinecap="square"
    />
  </SvgIcon>
);
