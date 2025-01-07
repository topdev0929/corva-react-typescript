import { makeStyles, SvgIcon } from '@material-ui/core';

const useStyles = makeStyles({
  svgIcon: {
    width: 16,
    height: 16,
  },
});

const IconCancel = () => {
  const classes = useStyles();
  return (
    <SvgIcon viewBox="0 0 16 16" className={classes.svgIcon}>
      <path
        d="M12.6668 4.27203L11.7268 3.33203L8.00016 7.0587L4.2735 3.33203L3.3335 4.27203L7.06016 7.9987L3.3335 11.7254L4.2735 12.6654L8.00016 8.9387L11.7268 12.6654L12.6668 11.7254L8.94016 7.9987L12.6668 4.27203Z"
        fill="#BDBDBD"
      />
    </SvgIcon>
  );
};

export default IconCancel;
