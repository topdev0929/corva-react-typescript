import { memo, useRef, useEffect, useState } from 'react';
import { Tooltip, makeStyles, Theme } from '@material-ui/core';
import classNames from 'classnames';

import { UniversalLink } from '../DevCenter/DevCenterRouterContext';
import { truncateInTheMiddle } from '../../utils/formatting'

import styles from './AssetNameLabel.styles.css';

interface PrimaryAssetNameLabelProps {
  assetName: string;
  classes?: { item?: string };
  coordinatesPixelWidth?: number;
  dataTestId: string;
  href: string;
  icon?: JSX.Element;
  statusBadge?: JSX.Element;
}

const getChipMaxWidth = (appWidth: number) => {
  if (appWidth >= 1024) return 244;
  if (appWidth >= 768) return 184;
  if (appWidth >= 420) return 134;
  return 44;
};

const useStyles = makeStyles<Theme, { chipMaxWidth: number }>({
  assetName: {
    maxWidth: ({ chipMaxWidth }) => chipMaxWidth,
  },
});

const AssetNameLabelComponent = ({
  assetName,
  classes,
  coordinatesPixelWidth,
  dataTestId,
  href,
  icon,
  statusBadge,
}: PrimaryAssetNameLabelProps): JSX.Element => {
  const [truncatedAssetName, setTruncatedAssetName] = useState(assetName);
  const assetNameRef = useRef<HTMLElement>();
  const scrollWidthRef = useRef<number>();
  const newChipMaxWidth = getChipMaxWidth(coordinatesPixelWidth);
  const chipMaxWidthRef = useRef<number>(newChipMaxWidth);
  const jsStyles = useStyles({ chipMaxWidth: newChipMaxWidth });

  useEffect(() => {
    setTruncatedAssetName(assetName);
    scrollWidthRef.current = null;
  }, [assetName]);

  useEffect(() => {
    if (!scrollWidthRef.current) scrollWidthRef.current = assetNameRef.current.scrollWidth;
  }, [scrollWidthRef.current]);

  useEffect(() => {
    if (!assetNameRef.current) return;
    if (!scrollWidthRef.current) return;

    if (newChipMaxWidth > chipMaxWidthRef.current) {
      setTruncatedAssetName(assetName);
      scrollWidthRef.current = null;
      chipMaxWidthRef.current = newChipMaxWidth;
      return;
    }

    const truncated = truncateInTheMiddle(
      assetName,
      assetNameRef.current.clientWidth,
      scrollWidthRef.current
    );

    setTruncatedAssetName(truncated);
    chipMaxWidthRef.current = newChipMaxWidth;
  }, [assetName, newChipMaxWidth, assetNameRef.current, scrollWidthRef.current]);

  return (
    <Tooltip title={assetName}>
      <div className={classNames(styles.wrapper)}>
        <UniversalLink
          className={classNames(styles.item, classes?.item)}
          data-testid={dataTestId}
          href={href}
        >
          {icon && <div className={styles.startIcon}>{icon}</div>}
          <span className={classNames(styles.assetName, jsStyles.assetName)} ref={assetNameRef}>
            {truncatedAssetName}
          </span>
          {statusBadge}
        </UniversalLink>
      </div>
    </Tooltip>
  );
};

export const AssetNameLabel = memo(AssetNameLabelComponent);
