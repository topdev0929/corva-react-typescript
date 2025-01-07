import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { range } from 'lodash';
import classnames from 'classnames';
import { Tooltip, makeStyles, IconButton, useTheme } from '@material-ui/core';
import { DragIndicator as DragIndicatorIcon } from '@material-ui/icons';

import { ActualStageData, StageScore, Theme, WellStageData, Proppant } from '../../types';
import { SCORE_TYPES } from '../../constants';

const useStyles = makeStyles<Theme>(theme => ({
  wellStages: {
    display: 'flex',
    backgroundColor: 'rgba(39, 39, 39, 0.80)',
    padding: 5,
    height: 58,
    marginBottom: 8,
    alignItems: 'center',
  },
  wellName: {
    width: 200,
    color: theme.palette.primary.text6,
    fontSize: 14,
    marginTop: 4,
  },
  stagesContainer: {
    flexGrow: 1,
    display: 'grid',
    position: 'relative',
    marginBottom: 22,
  },
  stageBox: {
    position: 'absolute',
    top: 0,
    height: 24,
    borderRight: `1px solid ${theme.palette.background.b5}`,
    borderRadius: 100,
  },
  designStage: {
    backgroundColor: theme.palette.background.b8,
  },
  actualStage: {
    backgroundColor: theme.palette.primary.text6,
    backgroundSize: 'contain',

    '&.highScore': {
      backgroundColor: theme.palette.success.bright,
      '&:hover': {
        boxShadow: `0px 0px 14px -2px ${theme.palette.success.bright}`,
      },
    },

    '&.mediumScore': {
      backgroundColor: theme.palette.warning.main,
      '&:hover': {
        boxShadow: `0px 0px 14px -2px ${theme.palette.warning.main}`,
      },
    },

    '&.lowScore': {
      backgroundColor: theme.palette.background.b5,
      border: `1px solid ${theme.palette.error.main}`,
      '&:hover': {
        boxShadow: `0px 0px 14px -2px ${theme.palette.error.main}`,
      },
    },
  },
  wellInfo: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 12,
    color: theme.palette.primary.text6,
    gap: 6,
  },
  stageInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: 60,
  },
  actualStageNumber: {
    color: theme.palette.primary.text1,
    fontSize: 14,
  },
  tooltipContainer: {
    opacity: 0.9,
  },
}));

type WellStagesProps = WellStageData & {
  item: {
    assetId: number;
    wellName: string;
    lastActualStage: number;
    lastDesignStage: number;
    scores: StageScore[];
    actualStageData: ActualStageData[];
  };
  commonProps: {
    maxStageNumber: number;
    designRate: number;
    designPressure: number;
  };
  dragHandle: (content: JSX.Element) => void;
};

const getRectStyle = ({ stageNumber, maxStageNumber }) => {
  const widthPerStage = 100 / maxStageNumber;
  return {
    width: `${widthPerStage}%`,
    right: `${widthPerStage * stageNumber}%`,
  };
};

const getStageScoreInfo = (
  stage: StageScore,
  designRate: number,
  designPressure: number
): { label: string; color: string; className?: string } => {
  if (stage.data.percentage_proppant_placed < 0.95) {
    return SCORE_TYPES.low;
  } else if (stage.data.mean_rate_breakdown_isip >= designRate) {
    return SCORE_TYPES.high;
  } else if (stage.data.mean_pressure_breakdown_isip >= designPressure) {
    return SCORE_TYPES.medium;
  }
  return SCORE_TYPES.low;
};

const getTooltipInfo = (
  stage: StageScore,
  proppants: Proppant[],
  score: string,
  valueColor: string,
  theme: Theme
) => (
  <div style={{ display: 'flex', flexDirection: 'column', padding: 4, gap: 8 }}>
    <div>Stage {stage.data.stage_number}</div>
    <div
      style={{
        display: 'flex',
        color: theme.palette.primary.text6,
        fontSize: 14,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: score !== SCORE_TYPES.low.label && valueColor,
          border: score === SCORE_TYPES.low.label && `1px solid ${theme.palette.error.main}`,
          marginRight: 4,
        }}
      />
      {score}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <div style={{ color: theme.palette.primary.text6 }}>Avg Rate</div>
      <div>{+stage.data.mean_rate_breakdown_isip.toFixed(1)}</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <div style={{ marginRight: 8, color: theme.palette.primary.text6 }}>Avg Pressure</div>
      <div>{+stage.data.mean_pressure_breakdown_isip.toFixed(1)}</div>
    </div>
    {proppants.map(proppant => (
      <div
        key={proppant.type}
        style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}
      >
        <div style={{ marginRight: 8, color: theme.palette.primary.text6 }}>{proppant.type}</div>
        <div>{proppant.amount}</div>
      </div>
    ))}
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <div style={{ marginRight: 8, color: theme.palette.primary.text6 }}>% Proppant Added</div>
      <div>
        {stage.data.percentage_proppant_placed
          ? (stage.data.percentage_proppant_placed * 100).toFixed(1)
          : 'NA'}
      </div>
    </div>
  </div>
);

const WellStages: FunctionComponent<WellStagesProps> = ({
  item: { assetId, lastActualStage, lastDesignStage, wellName, scores, actualStageData },
  commonProps: { maxStageNumber, designRate, designPressure },
  dragHandle,
}) => {
  const [containerWidth, setContainerWidth] = useState(null);
  const classes = useStyles();
  const containerRef = useRef(null);
  const theme: Theme = useTheme();
  const designStages =
    lastDesignStage > lastActualStage ? range(lastActualStage, lastDesignStage) : [];
  const actualStages = range(0, lastActualStage);
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current?.clientWidth);
    }
  }, [containerRef.current?.clientWidth]);

  return (
    <div className={classes.wellStages}>
      {dragHandle(
        <Tooltip title="Click and drag to reorder wells" placement="right">
          <IconButton size="medium">
            <DragIndicatorIcon fontSize="small" htmlColor={theme.palette.primary.text6} />
          </IconButton>
        </Tooltip>
      )}
      <div className={classes.wellInfo}>
        <div className={classes.wellName}>{wellName}</div>
        <div className={classes.stageInfo}>
          <div>
            <span className={classes.actualStageNumber}>{lastActualStage}</span>
            <span>{`/${lastDesignStage} Stg`}</span>
          </div>
          <div>{`${Math.round((lastActualStage / lastDesignStage) * 100)}%`}</div>
        </div>
      </div>
      <div className={classes.stagesContainer} ref={containerRef}>
        {designStages.map(stageNumber => (
          <Tooltip title={`Stage ${stageNumber + 1}`} key={`design-${assetId}-${stageNumber}`}>
            <div
              className={classnames(classes.stageBox, classes.designStage)}
              style={{
                ...getRectStyle({ stageNumber, maxStageNumber }),
                maxWidth: containerWidth / maxStageNumber,
              }}
            />
          </Tooltip>
        ))}
        {actualStages.map(stageNumber => {
          const score = scores.at(-(stageNumber + 1));
          if (!score) return null;

          const actualStageNumber = score.data.stage_number;
          const proppants = actualStageData.find(
            stage => stage.data.stage_number === actualStageNumber
          )?.data?.proppants;

          const { label, className, color } = getStageScoreInfo(score, designRate, designPressure);
          return (
            <Tooltip
              title={getTooltipInfo(score, proppants, label, color, theme)}
              key={`design-${assetId}-${stageNumber}`}
              classes={{
                popper: classes.tooltipContainer,
              }}
            >
              <div
                className={classnames(classes.stageBox, classes.actualStage, className)}
                style={{
                  ...getRectStyle({ stageNumber, maxStageNumber }),
                  maxWidth: containerWidth / maxStageNumber,
                }}
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default WellStages;
