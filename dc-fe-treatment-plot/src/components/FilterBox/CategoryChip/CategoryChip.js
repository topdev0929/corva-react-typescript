import { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles, Tooltip, Chip } from '@material-ui/core';
import classNames from 'classnames';

import { LayoutContext } from '../../../context/layoutContext';

import { FilterBoxContext } from '../../../context/filterBoxContext';

const StyledTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: 'rgba(59, 59, 59, 0.9)',
  },
}))(Tooltip);

const useStyles = makeStyles({
  seriesChip: {
    height: '32px',
    maxWidth: '100%',
    marginBottom: '8px',
    '&.horizontal': {
      marginRight: 8,
    },
  },
});

const Status = ({ color }) => (
  <div
    style={{
      border: '4px solid',
      borderColor: color,
      borderRadius: '50%',
      marginLeft: 12,
      marginRight: '-8px',
    }}
  />
);

Status.propTypes = {
  color: PropTypes.string.isRequired,
};

function CategoryChip(props) {
  const { paramList, seriesKey, category, graphColors } = props;
  const { isResponsive } = useContext(LayoutContext);

  const classes = useStyles();
  const seriesObj = paramList.find(series => series.key === seriesKey);
  const seriesColor = graphColors[seriesKey] || seriesObj?.color;

  const { dispatch } = useContext(FilterBoxContext);

  const handleChipClick = () => {
    dispatch({ type: 'OPEN_DIALOG', data: { ...seriesObj, category, color: seriesColor } });
  };

  if (!paramList.length) return null;

  return (
    <StyledTooltip title="Edit Settings">
      <div>
        <Chip
          variant="outlined"
          label={seriesObj?.name || 'N/A'}
          clickable
          icon={<Status color={seriesColor} />}
          onClick={handleChipClick}
          className={classNames(classes.seriesChip, isResponsive && 'horizontal')}
        />
      </div>
    </StyledTooltip>
  );
}

CategoryChip.propTypes = {
  paramList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  seriesKey: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  graphColors: PropTypes.shape({}).isRequired,
};

export default CategoryChip;
