import PropTypes from 'prop-types';

import { makeStyles, Typography, Chip } from '@material-ui/core';

import { CATEGORY_KEY_VALUES } from './constants';

const PAGE_NAME = 'AssetTypesSection';

const useStyles = makeStyles({
  assetSelectorWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  description: {
    color: '#BDBDBD',
    fontSize: '12px',
    lineHeight: '17px',
    marginBottom: '8px',
  },
  assetTypeChip: {
    color: '#BDBDBD',
    '&:last-child': {
      marginRight: '0px',
    },
  },
});

const AssetTypesSection = ({ onClickAssetType }) => {
  const classes = useStyles();

  return (
    <div>
      <Typography className={classes.description}>I&apos;m looking for...</Typography>
      <div className={classes.assetSelectorWrapper}>
        {CATEGORY_KEY_VALUES.map(([key, item]) => (
          <Chip
            data-testid={`${PAGE_NAME}_chip_${item.labelPlural}`}
            key={key}
            className={classes.assetTypeChip}
            variant="outlined"
            label={item.labelPlural}
            onClick={() => onClickAssetType(key)}
          />
        ))}
      </div>
    </div>
  );
};

AssetTypesSection.propTypes = {
  onClickAssetType: PropTypes.func.isRequired,
};

export default AssetTypesSection;
