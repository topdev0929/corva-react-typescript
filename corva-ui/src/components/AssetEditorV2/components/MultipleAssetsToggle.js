import classNames from 'classnames';
import { makeStyles, Tooltip } from '@material-ui/core';
import { InfoOutlined as InfoIcon } from '@material-ui/icons';
import SwitchControl from '~/components/SwitchControl';

const useStyles = makeStyles(({ palette }) => ({
  root: { marginBottom: '-2px', marginTop: '-8px', marginLeft: '-9px' },
  title: { display: 'flex', alignItems: 'center' },
  infoIcon: {
    marginLeft: 4,
    color: palette.primary.text6,

    '&:hover': {
      color: palette.primary.contrastText,
    },
  },
}));

const MultipleAssetsToggle = ({ isChecked, title, className, ...props }) => {
  const styles = useStyles();

  return (
    <SwitchControl
      className={classNames(styles.root, className)}
      size="small"
      rightLabel={
        <span className={styles.title}>
          {title}
          <Tooltip
            title="A separate app will be placed on the dashboard for each asset chosen"
            placement="bottom-start"
          >
            <InfoIcon fontSize="small" className={styles.infoIcon} />
          </Tooltip>
        </span>
      }
      color="primary"
      checked={isChecked}
      {...props}
    />
  );
};

MultipleAssetsToggle.defaultProps = {
  title: 'Multiple Assets',
};

export default MultipleAssetsToggle;
