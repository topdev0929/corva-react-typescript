import PropTypes from 'prop-types';

function Icon({ isActive }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
      <g fill={isActive ? '#9E9E9E' : '#9e9e9e66'} clipPath="url(#clip0)">
        <path d="M12 .5v6c0 .3.2.5.5.5s.5-.2.5-.5v-6c0-.3-.2-.5-.5-.5s-.5.2-.5.5zM9 .5v6c0 .3.2.5.5.5s.5-.2.5-.5v-6c0-.3-.2-.5-.5-.5S9 .2 9 .5zM6 .5v6c0 .3.2.5.5.5s.5-.2.5-.5v-6c0-.3-.2-.5-.5-.5S6 .2 6 .5zM4 6.5v-6c0-.3-.2-.5-.5-.5S3 .2 3 .5v6c0 .3.2.5.5.5s.5-.2.5-.5zM12 9.5c0 .1.1.3.1.4l2.2 2.1H.5c-.3 0-.5.2-.5.5s.2.5.5.5h13.8l-2.1 2.1c-.1.1-.2.3-.2.4 0 .3.2.5.5.5.1 0 .3-.1.4-.1l3-3c0-.1.1-.3.1-.4 0-.1-.1-.3-.2-.4l-3-3s-.2-.1-.3-.1c-.3 0-.5.2-.5.5z" />
      </g>
      <defs>
        <clipPath id="clip0">
          <path
            fill={isActive ? '#9E9E9E' : '#9e9e9e66'}
            d="M0 0H16V16H0z"
            transform="rotate(-90 8 8)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

Icon.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default Icon;
