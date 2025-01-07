import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  subjectIndicator: {
    background: '#388e3c',
    borderRadius: '10px',
    padding: '4px',
    fontSize: '12px',
    marginLeft: '4px',
  },
});

function SubjectIndicator() {
  const classes = useStyles();
  return <div className={classes.subjectIndicator}>Subject</div>;
}

export default SubjectIndicator;
