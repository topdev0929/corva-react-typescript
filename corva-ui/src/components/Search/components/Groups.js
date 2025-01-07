import PropTypes from 'prop-types';

import { makeStyles, Typography, Chip } from '@material-ui/core';

const useStyles = makeStyles(({ palette }) => ({
  selectorWrapper: {
    padding: '16px 0 12px 16px',
  },
  description: {
    color: palette.primary.text6,
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '17px',
    paddingBottom: '8px',
  },
  chip: {
    marginRight: '8px',
    color: palette.primary.text6,
    '&:last-child': {
      marginRight: '0px',
    },
  },
}));

const Groups = ({ onGroupClick, groups }) => {
  const classes = useStyles();

  return (
    <div className={classes.selectorWrapper}>
      <Typography className={classes.description}>I&apos;m looking for...</Typography>
      <div>
        {groups?.map(({ id, name }) => (
          <Chip
            key={id}
            className={classes.chip}
            variant="outlined"
            label={name}
            onClick={() => onGroupClick(id)}
          />
        ))}
      </div>
    </div>
  );
};

Groups.propTypes = {
  onGroupClick: PropTypes.func.isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Groups;
