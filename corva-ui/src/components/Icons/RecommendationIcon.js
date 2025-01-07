import PropTypes from 'prop-types';

const RecommendationIcon = ({ height, width }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12.7098 2.28957L21.7098 11.2896C22.0998 11.6896 22.0998 12.3196 21.7098 12.6996L12.7098 21.6996C12.3198 22.0896 11.6898 22.0896 11.2998 21.6996L2.29982 12.6996C1.90982 12.3096 1.90982 11.6796 2.29982 11.2896L11.2998 2.28957C11.6898 1.89957 12.3198 1.89957 12.7098 2.28957ZM13.9998 11.9996V14.4996L17.4998 10.9996L13.9998 7.49957V9.99957H8.99982C8.44982 9.99957 7.99982 10.4496 7.99982 10.9996V14.9996H9.99982V11.9996H13.9998Z" fill="#75DB29"/>
  </svg>
)

RecommendationIcon.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
}

RecommendationIcon.defaultProps = {
  height: 28,
  width: 28,
}

export default RecommendationIcon;