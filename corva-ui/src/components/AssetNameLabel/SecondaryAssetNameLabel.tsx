import classNames from 'classnames';

import { AssetNameLabel } from './AssetNameLabel';

import styles from './SecondaryAssetNameLable.styles.css';

interface SecondaryAssetNameLabelProps {
  assetName: string;
  coordinatesPixelWidth?: number;
  dataTestId: string;
  href: string;
  icon: JSX.Element;
  isColored?: boolean;
  pageName: string;
}

export const SecondaryAssetNameLabel = (props: SecondaryAssetNameLabelProps): JSX.Element => {
  const { isColored = true, ...otherProps } = props;

  return (
    <AssetNameLabel
      classes={{
        item: classNames(styles.secondaryAsset, isColored && styles.secondaryAssetColor),
      }}
      {...otherProps}
    />
  );
};
