import PropTypes from 'prop-types';

const SendIcon = ({ height, width }) => (
  <svg width={width} height={height} viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.01 18L21 9L0.01 0L0 7L15 9L0 11L0.01 18Z" fill="#03BCD4"/>
  </svg>
)

SendIcon.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
}

SendIcon.defaultProps = {
  height: 21,
  width: 21,
}

export default SendIcon;