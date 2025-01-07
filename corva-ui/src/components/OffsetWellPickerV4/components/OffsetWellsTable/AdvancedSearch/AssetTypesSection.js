import PropTypes from 'prop-types';

import { makeStyles, Typography, Chip } from '@material-ui/core';

import { CATEGORY_KEY_VALUES } from './constants';

const PAGE_NAME = 'AssetTypesSection';

const useStyles = makeStyles(theme => ({
  assetSelectorWrapper: {
    margin: 8,
  },
  description: {
    color: theme.palette.primary.text6,
    fontSize: '12px',
    lineHeight: '17px',
    paddingBottom: '8px',
  },
  assetTypeChip: {
    marginRight: '8px',
    color: theme.palette.primary.text6,
    '&:last-child': {
      marginRight: '0px',
    },
  },
}));

const AssetTypesSection = ({ onClickAssetType }) => {
  const classes = useStyles();

  return (
    <div className={classes.assetSelectorWrapper}>
      <Typography className={classes.description}>I&apos;m looking for...</Typography>
      <div>
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
