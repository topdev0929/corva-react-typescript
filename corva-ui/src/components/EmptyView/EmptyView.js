// NOTE: Please do not use this component as it will be removed soon
// Use EmptyState instead
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import classnames from 'classnames';

import NoDataImg from './no_data.png';
import Arrow from './arrow.svg';

const PAGE_NAME = 'EmptyView';

const useStyles = makeStyles({
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '16px',
    zIndex: ({ showArrow }) => (showArrow ? 1 : 'auto'),
    '@media (max-height:350px)': {
      paddingTop: '56px',
    },
    '@media (max-width:500px)': {
      paddingTop: '128px',
    },
  },
  errorImage: {
    width: '390px',
    height: '300px',
    marginTop: '24px',
    '@media (max-height:400px)': {
      width: '260px',
      height: '200px',
    },
    '@media (max-height:350px), (max-width: 580px) and (max-height:550px)': {
      display: 'none',
    },
    '@media (max-width:500px)': {
      width: '260px',
      height: '200px',
    },
  },
  title: {
    fontSize: '32px',
    fontStyle: 'italic',
    color: '#9E9E9E',
    lineHeight: '37px',
    fontWeight: 'normal',
    '@media (max-height:400px)': {
      fontSize: '24px',
    },
    '@media (max-width:500px)': {
      fontSize: '24px',
    },
  },
  description: {
    fontSize: '16px',
    color: '#9E9E9E',
  },
  arrow: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: -1,
    '@media (max-width: 960px)': { display: 'none' },
  },
});

function EmptyView({ title, description, showArrow, customStyles }) {
  const classes = useStyles({ showArrow });

  return (
    <div
      data-testid={`${PAGE_NAME}_wrapper`}
      className={classnames(classes.wrapper, customStyles.wrapper)}
    >
      <Typography className={classnames(classes.title, customStyles.title)}>{title}</Typography>
      <Typography className={classnames(classes.description, customStyles.description)}>
        {description}
      </Typography>
      <img src={NoDataImg} className={classes.errorImage} alt="error state" />
      {showArrow && (
        <img src={Arrow} alt="arrow" className={classnames(classes.arrow, customStyles.arrow)} />
      )}
    </div>
  );
}

EmptyView.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  showArrow: PropTypes.bool,
  customStyles: PropTypes.shape({
    wrapper: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    arrow: PropTypes.string,
  }),
};

EmptyView.defaultProps = {
  title: 'No Data Available',
  description: '',
  showArrow: false,
  customStyles: {},
};

export default EmptyView;
