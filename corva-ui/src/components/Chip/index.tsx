import { Chip as MuiChip, makeStyles, ChipProps as MuiChipProps } from '@material-ui/core';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const checkIconSvg = ({ width = 18, height = 14, fill }) => {
  const fillColor = fill.replace('#', '%23');

  return `<svg width='${width}' height='${height}' viewBox='0 0 18 14' fill='${fillColor}' xmlns='http://www.w3.org/2000/svg'><path d='M6 11.1698L1.83 6.99984L0.410004 8.40984L6 13.9998L18 1.99984L16.59 0.589844L6 11.1698Z'/></svg>`;
};

const useStyles = makeStyles(theme => ({
  checked: {
    '&::before': {
      content: `url("data:image/svg+xml; utf8, ${checkIconSvg({
        fill: theme.palette.primary.main,
      })}")`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      lineHeight: '24px',
      marginLeft: 8,
      marginRight: '-4px',
      paddingTop: 3,
    },
    '&.Mui-disabled::before': {
      content: `url("data:image/svg+xml; utf8, ${checkIconSvg({
        fill: theme.palette.primary.text8,
      })}")`,
    },
    '&.MuiChip-sizeSmall::before': {
      content: `url("data:image/svg+xml; utf8, ${checkIconSvg({
        width: 12,
        fill: theme.palette.primary.main,
      })}")`,
      width: 16,
      height: 16,
    },
    '&.MuiChip-sizeSmall.Mui-disabled::before': {
      content: `url("data:image/svg+xml; utf8, ${checkIconSvg({
        width: 12,
        fill: theme.palette.primary.text8,
      })}")`,
    },
    '&.MuiChip-root.MuiChip-clickable': {
      '& .MuiChip-label, & .MuiChip-deleteIcon, & .MuiChip-icon': {
        color: '#FFFFFF',
      },
    },
    '& .MuiChip-label:first-child': {
      marginLeft: '-4px',
    },
  },
}));

interface ChipProps extends MuiChipProps, PropTypes.InferProps<typeof chipPropTypes> {}

const Chip = (props: ChipProps): JSX.Element => {
  const { checked, classes = {}, 'data-testid': dataTestId } = props;
  const styles = useStyles();

  if (!checked) {
    return <MuiChip data-testid={dataTestId} {...props} />;
  }

  return (
    <MuiChip
      data-testid={dataTestId}
      {...props}
      classes={{
        ...classes,
        root: classNames(classes.root, styles.checked),
      }}
    />
  );
};

const chipPropTypes = {
  checked: PropTypes.bool,
  'data-testid': PropTypes.string,
};

Chip.propTypes = chipPropTypes;

Chip.defaultProps = {
  checked: false,
  'data-testid': 'Chip',
};

export default Chip;
