import PropTypes from 'prop-types';

function Icon({ isActive }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" fill="none" viewBox="0 0 10 16">
      <path
        fill={isActive ? '#9E9E9E' : '#9e9e9e66'}
        d="M8.2.1l-8 7.4c-.1.2-.2.3-.2.4 0 .2.1.3.1.4l8 7.6c.2.1.6.1.7 0 .2-.2.2-.6 0-.8L1.2 7.9 8.9.8c.2-.2.2-.5 0-.7-.2-.1-.5-.1-.7 0z"
      />
    </svg>
  );
}

Icon.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default Icon;
