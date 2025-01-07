import { IconProps } from '../types';

function NoSegmentAppIcon({
  width = 36,
  height = 36,
  className,
  'data-testid': PAGE_NAME = 'NoSegmentAppIcon',
}: IconProps) {
  return (
    <svg
      data-testid={`${PAGE_NAME}_NoIcon`}
      width={width}
      height={height}
      className={className}
      style={{ opacity: 0.5 }}
      fill="#03BCD4"
      viewBox="110 110 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M810.666667 128H213.333333c-47.146667 0-85.333333 38.186667-85.333333 85.333333v597.333334c0 47.146667 38.186667 85.333333 85.333333 85.333333h597.333334c47.146667 0 85.333333-38.186667 85.333333-85.333333V213.333333c0-47.146667-38.186667-85.333333-85.333333-85.333333zM213.333333 212.906667h128c0 70.613333-57.386667 128.426667-128 128.426666V212.906667zM213.333333 512v-85.333333c117.76 0 213.333333-96 213.333334-213.76h85.333333C512 377.813333 378.24 512 213.333333 512z m0 256l149.333334-192 106.666666 128.213333L618.666667 512l192 256H213.333333z" />
    </svg>
  );
}

export default NoSegmentAppIcon;
