import { FunctionComponent, useMemo } from 'react';
import { Tooltip, makeStyles } from '@material-ui/core';

import { TimeRange } from '@/types/Settings';
import { StageCaptionInfo } from './types';
import { MuiTheme } from '@/types/MuiTheme';
import { calculateStageNameItemStyles, getTruncatedAssetName } from './utils';

type StyleProps = {
  isLive: boolean;
  isZoomedIn: boolean;
};

const useStyles = makeStyles((theme: MuiTheme) => ({
  captionContainer: (props: StyleProps) => ({
    position: 'absolute',
    top: 0,
    height: 17,
    color: props.isLive ? theme.palette.success.bright : theme.palette.primary.text7,
    fontSize: 11,
  }),
  captionContent: (props: StyleProps) => ({
    position: 'sticky',
    left: props.isZoomedIn ? '45%' : 0,
    right: props.isZoomedIn ? '45%' : 'unset',
  }),
  stageNumber: {
    fontSize: 14,
  },
}));

const MINIMAL_WIDTH = 15;

interface ChartStageNameItemProps extends StageCaptionInfo {
  assetTimeLimits: TimeRange;
  secondsPerPixel: number;
  isSingleStage: boolean;
  isLive: boolean;
}

const ChartStageNameItem: FunctionComponent<ChartStageNameItemProps> = props => {
  const { stageNumber, isSingleStage, isLive } = props;
  const { styles: captionStyles, isZoomedIn } = calculateStageNameItemStyles(props);

  const styles = useStyles({ isLive, isZoomedIn: !isSingleStage && isZoomedIn });

  const { assetName, tooltip } = useMemo(
    () => getTruncatedAssetName(captionStyles.width, stageNumber, props.assetName),
    [captionStyles.width, stageNumber, props.assetName]
  );

  if (Number.isFinite(captionStyles.width) && +captionStyles.width < MINIMAL_WIDTH) return null;

  return (
    <div className={styles.captionContainer} style={captionStyles}>
      <Tooltip title={tooltip}>
        <span className={styles.captionContent}>
          {stageNumber !== 0 && <span className={styles.stageNumber}>{stageNumber}</span>}{' '}
          {assetName}
        </span>
      </Tooltip>
    </div>
  );
};

export { ChartStageNameItem };
