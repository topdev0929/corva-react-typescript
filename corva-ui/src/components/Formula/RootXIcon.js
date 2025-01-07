import PropTypes from 'prop-types';

const RootXIcon = ({ color }) => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.25 1.25H6L3.75 9.5L2.25 5.75H0.75"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.75 5.375L10.5 9.5"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 5.375L6.75 9.5"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

RootXIcon.propTypes = {
  color: PropTypes.string,
};

RootXIcon.defaultProps = {
  color: '#03BCD4',
};

export default RootXIcon;
