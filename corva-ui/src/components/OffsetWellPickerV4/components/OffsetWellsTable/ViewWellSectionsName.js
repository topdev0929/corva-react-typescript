import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  mainContainer: {
    padding: '8px',
  },
  title: {
    fontSize: '12px',
    lineHeight: '16px',
    marginBottom: '8px',
  },
  sectionNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionName: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
});

const ViewWellSectionsName = ({ wellSectionNames }) => {
  const classes = useStyles();
  if (isEmpty(wellSectionNames)) return null;

  return (
    <div className={classes.mainContainer}>
      <div className={classes.title}>Best in Well Sections: </div>
      <div className={classes.sectionNameContainer}>
        {wellSectionNames.map(sectionName => (
          <div className={classes.sectionName}>
            <Typography variant="body2">{sectionName}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

ViewWellSectionsName.propTypes = {
  wellSectionNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ViewWellSectionsName;
