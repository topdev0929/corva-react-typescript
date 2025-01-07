import { memo } from 'react';
import PropTypes from 'prop-types';
import { SvgIcon, useTheme } from '@material-ui/core';

const AnnotationIcon = ({ height, width }) => {
  const theme = useTheme();
  return (
    <SvgIcon viewBox="0 0 24 24" fill="none" width={width} height={height}>
      <path
        d="M2.57129 7.37135V13.2856C2.57129 15.5142 4.37129 17.3142 6.59986 17.3142H15.1713L20.057 20.4856C20.1029 20.5086 20.1427 20.5316 20.1796 20.5529C20.2805 20.6111 20.3601 20.6571 20.4856 20.6571C20.657 20.6571 20.7427 20.6571 20.9141 20.5713C21.1713 20.3999 21.3427 20.1428 21.3427 19.7999V7.37135C21.3427 5.14277 19.5427 3.34277 17.3141 3.34277H6.59986C4.37129 3.34277 2.57129 5.14277 2.57129 7.37135ZM12.9 11.4H15.6C16.095 11.4 16.5 10.995 16.5 10.5C16.5 10.005 16.095 9.6 15.6 9.6H12.9V6.9C12.9 6.405 12.495 6 12 6C11.505 6 11.1 6.405 11.1 6.9V9.6H8.4C7.905 9.6 7.5 10.005 7.5 10.5C7.5 10.995 7.905 11.4 8.4 11.4H11.1V14.1C11.1 14.595 11.505 15 12 15C12.495 15 12.9 14.595 12.9 14.1V11.4Z"
        fill={theme.palette.secondary}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </SvgIcon>
  );
};

AnnotationIcon.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

AnnotationIcon.defaultProps = {
  height: 24,
  width: 24,
};

export default memo(AnnotationIcon);
