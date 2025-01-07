import { makeStyles } from '@material-ui/core';
import { range } from 'lodash';
import { FunctionComponent, useLayoutEffect, useRef, useState } from 'react';

const useStyles = makeStyles({
  numberContainer: {
    marginLeft: 246,
    marginRight: 8,
    position: 'relative',
  },
  stage: {
    position: 'absolute',
    top: 0,
    fontSize: 11,
    color: '#9e9e9e',
  },
});

const StageNumbers: FunctionComponent<{ maxStageNumber: number }> = ({ maxStageNumber }) => {
  const classes = useStyles();
  const containerRef = useRef(null);
  const [stages, setStages] = useState([]);

  useLayoutEffect(() => {
    // const width = containerRef?.current?.clientWidth || 0;

    // if (!width) return;

    // const maxCount = Math.round(width / 18);
    // const stageStep = maxCount ? Math.ceil(maxStageNumber / maxCount) : 0;

    setStages(range(0, maxStageNumber, 2));
  }, [maxStageNumber]);

  return (
    <div className={classes.numberContainer} ref={containerRef}>
      {stages.map(stage => (
        <span
          key={stage} 
          className={classes.stage}
          style={{ right: `${stage * (100 / maxStageNumber)}%` }}
        >
          {stage + 1}
        </span>
      ))}
    </div>
  );
};

export default StageNumbers;
