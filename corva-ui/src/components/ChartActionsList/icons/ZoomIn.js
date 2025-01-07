import PropTypes from 'prop-types';

function Icon({ isActive }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
      <path
        fill={isActive ? '#9E9E9E' : '#9e9e9e66'}
        d="M15.8 15.1l-4.5-4.3c1-1.1 1.6-2.7 1.6-4.3C13 2.9 10.1 0 6.5 0 2.9 0 0 2.9 0 6.5S2.9 13 6.5 13c1.6 0 3-.6 4.1-1.5l4.5 4.4c.1.1.2.1.3.1.1 0 .3-.1.4-.2.3-.2.2-.5 0-.7zM1 6.5C1 3.5 3.5 1 6.5 1S12 3.5 12 6.5 9.5 12 6.5 12 1 9.5 1 6.5z"
      />
      <path
        fill={isActive ? '#9E9E9E' : '#9e9e9e66'}
        d="M9.5 6H7V3.5c0-.3-.2-.5-.5-.5s-.5.2-.5.5V6H3.5c-.3 0-.5.2-.5.5s.2.5.5.5H6v2.5c0 .3.2.5.5.5s.5-.2.5-.5V7h2.5c.3 0 .5-.2.5-.5S9.8 6 9.5 6z"
      />
    </svg>
  );
}

Icon.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default Icon;
