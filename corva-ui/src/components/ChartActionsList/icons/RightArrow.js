import PropTypes from 'prop-types';

function Icon({ isActive }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" fill="none" viewBox="0 0 10 16">
      <path
        fill={isActive ? '#9E9E9E' : '#9e9e9e66'}
        d="M1.8 15.9l8-7.4c.1-.2.2-.3.2-.4 0-.1-.1-.3-.1-.4L1.9.1c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L8.8 8l-7.7 7.1c-.2.2-.2.5 0 .7.2.2.5.2.7.1z"
      />
    </svg>
  );
}

Icon.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default Icon;
