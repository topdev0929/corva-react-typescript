import { InputAdornment, makeStyles } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

const useStyles = makeStyles(({ palette }) => ({
  searchIcon: {
    fontSize: '24px !important',
    fill: `${palette.primary.text6} !important`,
  },
}));

const InputAdornmentLeft = ({ className, children }) => {
  const classes = useStyles();
  return (
    <InputAdornment className={className} position="start">
      {children || <SearchIcon className={classes.searchIcon} />}
    </InputAdornment>
  );
};

export default InputAdornmentLeft;
