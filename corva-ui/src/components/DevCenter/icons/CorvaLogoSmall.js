import PropTypes from 'prop-types';

function CorvaLogoSmall({ color, width, height }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="white"
      viewBox="0 0 36 36"
    >
      <path
        d="M16.0615 6.04102C14.9975 6.04102 14.3696 6.85435 14.0909 7.33968L3.49355 25.341C3.40822 25.4863 3.40689 25.6663 3.49089 25.8117C3.57489 25.9583 3.72955 26.0477 3.89888 26.0477H6.54022C6.70689 26.0477 6.86155 25.9597 6.94555 25.8144L16.0109 10.2863L23.2762 22.9544H15.0256C14.8642 22.9544 14.7135 23.037 14.6282 23.1743L13.2789 25.3277C13.1882 25.473 13.1829 25.6544 13.2656 25.8037C13.3482 25.953 13.5056 26.0463 13.6762 26.0463H28.0802C28.2482 26.0463 28.4029 25.957 28.4869 25.8117C28.5709 25.6663 28.5709 25.4863 28.4856 25.3423L18.0322 7.33835C17.7616 6.85702 17.1402 6.04102 16.0615 6.04102Z"
        fill={color}
      />
    </svg>
  );
}

CorvaLogoSmall.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

CorvaLogoSmall.defaultProps = {
  color: 'white',
  width: 36,
  height: 36,
};

export default CorvaLogoSmall;
