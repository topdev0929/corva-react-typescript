import PropTypes from 'prop-types';

import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import { makeStyles } from '@material-ui/core';

import TextField from '~/components/TextField';

const useStyles = makeStyles({ textField: { width: '200px' } });

export const InputTextWithIcons = props => {
  const styles = useStyles();
  return (
    <TextField
      {...props}
      className={styles.textField}
      startIcon={props.showStartIcon && <SentimentSatisfiedIcon />}
      endIcon={props.showEndIcon && <SentimentDissatisfiedIcon />}
    />
  );
};

InputTextWithIcons.propTypes = {
  showStartIcon: PropTypes.bool,
  showEndIcon: PropTypes.bool,
};

InputTextWithIcons.defaultProps = {
  showStartIcon: true,
  showEndIcon: true,
};

export default {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    docs: {
      description: {
        component:
          '<div>Use MUI Inputs and TextFields. More information <a href="https://material-ui.com/api/input/">here</a></div>',
      },
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9573%3A7777',
  },
};
