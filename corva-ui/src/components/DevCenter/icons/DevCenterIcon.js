import PropTypes from 'prop-types';

function DevCenterIcon({ color, width, height }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 36 36"
    >
      <path
        fill={color}
        d="M15.428 26.228c-.128 0-.385 0-.514-.128-.643-.257-.9-1.029-.643-1.543l5.015-14.014c.257-.643 1.028-.9 1.542-.643.643.257.9 1.028.643 1.543l-5.014 14.014c-.129.514-.643.771-1.029.771zM10.8 24.557a1.39 1.39 0 01-.9-.386l-4.5-5.4c-.514-.514-.514-1.286 0-1.671l4.5-5.4c.515-.515 1.286-.515 1.672 0 .514.514.514 1.285 0 1.671L7.972 18l3.6 4.5c.514.514.514 1.285 0 1.671-.257.257-.514.386-.772.386zM25.2 24.685c.257 0 .643-.128.9-.385l4.5-5.529c.514-.514.514-1.286 0-1.671l-4.5-5.4c-.514-.515-1.286-.515-1.671 0-.515.514-.515 1.285 0 1.671l3.6 4.5-3.6 4.757c-.515.514-.515 1.286 0 1.672.257.257.514.385.771.385z"
      />
    </svg>
  );
}

DevCenterIcon.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

DevCenterIcon.defaultProps = {
  color: '#03BCD4',
  width: 36,
  height: 36,
};

export default DevCenterIcon;
