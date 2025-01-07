import PropTypes from 'prop-types';
import { SvgIcon, useTheme } from '@material-ui/core';

const EmojiIcon = ({ height, width }) => {
  const theme = useTheme();
  return (
    <SvgIcon viewBox="0 0 20 20" fill="none" width={width} height={height}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99 0C4.47 0 0 4.48 0 10C0 15.52 4.47 20 9.99 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 9.99 0ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18ZM15 7.5C15 8.33 14.33 9 13.5 9C12.67 9 12 8.33 12 7.5C12 6.67 12.67 6 13.5 6C14.33 6 15 6.67 15 7.5ZM6.5 9C7.33 9 8 8.33 8 7.5C8 6.67 7.33 6 6.5 6C5.67 6 5 6.67 5 7.5C5 8.33 5.67 9 6.5 9ZM15.11 12C14.31 14.04 12.33 15.5 10 15.5C7.67 15.5 5.69 14.04 4.89 12H15.11Z"
        fill={theme.palette.primary.text6}
      />
    </SvgIcon>
  );
};

EmojiIcon.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

EmojiIcon.defaultProps = {
  height: 20,
  width: 22,
};

export default EmojiIcon;
