import PropTypes from 'prop-types';

function NumberCircle({ bgColor,
                        textColor,
                        width,
                        height,
                        fontSize,
                        children,
                        'data-testid': dataTestId
}) {
  const style = {
    borderRadius: 'calc(100vh)',
    background: bgColor,
    color: textColor,
    fontSize,
    width,
    height,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'normal',
    minWidth: 24,
  };

  return <div data-testid={dataTestId} style={style}>{children}</div>;
}

NumberCircle.propTypes = {
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  fontSize: PropTypes.number,
  children: PropTypes.node.isRequired,
  'data-testid': PropTypes.string,
};

NumberCircle.defaultProps = {
  width: 24,
  height: 24,
  fontSize: 12,
  'data-testid': 'NumberCircle',
};

export default NumberCircle;
