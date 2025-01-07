/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import { upperFirst } from 'lodash';
import moment from 'moment';
import classnames from 'classnames';

import { DRILLING_WELL_SUMMARY, COMPLETION_WELL_SUMMARY, DRILLOUT_WELL_SUMMARY } from '~/constants';
import { BHASchematic } from '~/components/Drillstring';
import { schematic as schematicUtils } from '~/utils/drillstring';
import utils from '~/utils/main';
import { orDash } from '~/utils/formatting';
import { convertValue, getUnitDisplay } from '~/utils/convert';
import BitIcon from '~/assets/bit.svg';
import HoleDepthIcon from '~/assets/hole_depth.svg';
import DrilloutIcon from '~/assets/drillout.svg';
import UpArrowIcon from './assets/up_arrow.svg';
import LeftArrowIcon from './assets/left_arrow.svg';

const useStyles = makeStyles({
  value: {
    fontSize: '14px',
    fontWeight: 500,
  },
  valueSuffix: {
    color: '#9E9E9E',
  },
  hasLeftMargin: {
    marginLeft: 4,
  },
  bhaRoot: {
    display: 'flex',
    alignItems: 'center',
  },
  bhaIdRoot: {
    backgroundColor: '#2196F3',
    borderRadius: '50%',
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  realBhaRoot: {
    width: '16px',
    height: '16px',
  },
  bhaIdLabel: {
    fontWeight: 500,
    fontSize: '12px',
  },
  dummyBhaIdLabel: {
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  bhaActiveIndicator: {
    fontSize: '12px',
    padding: '4px',
    fontWeight: 500,
  },
  nptRoot: {
    display: 'flex',
    alignItems: 'center',
  },
  rectIndicator: {
    width: '8px',
    height: '8px',
    backgroundColor: '#D32F2F',
    borderRadius: '2px',
    marginRight: '8px',
  },
  stageActual: {
    fontSize: '16px',
  },
  stagePercent: {
    color: '#9E9E9E',
    marginLeft: '4px',
  },
  fluidProppantType: {
    color: '#9E9E9E',
  },
  valueWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  rightImg: {
    marginRight: '4px',
  },
  centerImg: {
    marginLeft: '4px',
    marginRight: '4px',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
  profileRoot: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  profile: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
    backgroundSize: '20px 20px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  plugsIcon: { marginLeft: -8 },
});

function WellSummaryItemValue({ item, summaryData }) {
  const classes = useStyles();

  if (!summaryData) {
    return null;
  }

  // Hole depth for drilling
  if (item.key === DRILLING_WELL_SUMMARY.HOLE_DEPTH.key) {
    const { holeDepth } = item.dataGetter(summaryData);
    return Number.isFinite(holeDepth) ? (
      <div className={classes.valueWrapper}>
        <img src={HoleDepthIcon} alt="hole_depth" className={classes.centerImg} />
        <span className={classnames(classes.value, classes.hasLeftMargin)}>
          {Math.floor(holeDepth)}’
        </span>
      </div>
    ) : (
      '-'
    );
  }

  // Bit/Hole depth for drilling
  if (item.key === DRILLING_WELL_SUMMARY.BIT_HOLE_DEPTH.key) {
    const { bitDepth, holeDepth } = item.dataGetter(summaryData);
    return [bitDepth, holeDepth].every(Number.isFinite) ? (
      <div className={classes.valueWrapper}>
        <img src={BitIcon} alt="bit_depth" className={classes.rightImg} />
        <span className={classes.value}>{Math.floor(bitDepth)}’ / </span>
        <img src={HoleDepthIcon} alt="hole_depth" className={classes.centerImg} />
        <span className={classes.value}>{Math.floor(holeDepth)}’</span>
      </div>
    ) : (
      '-'
    );
  }

  // Divergence for drilling
  if (item.key === DRILLING_WELL_SUMMARY.DIVERGENCE.key) {
    const { distance, ahead, right } = item.dataGetter(summaryData);
    return [distance, ahead, right].every(Number.isFinite) ? (
      <div className={classes.valueWrapper}>
        <span className={classes.value}>
          {`${convertValue(distance, 'length', 'ft')} ${getUnitDisplay('length')}`}
        </span>
        <img
          src={UpArrowIcon}
          alt="up_arrow"
          className={classnames(classes.centerImg, { [classes.rotate]: ahead < 0 })}
        />
        <span className={classes.value}>
          {`${Math.abs(convertValue(ahead, 'length', 'ft'))} ${getUnitDisplay('length')} ${
            ahead > 0 ? 'Ahead' : 'Behind'
          }`}
        </span>
        <img
          src={LeftArrowIcon}
          alt="left_arrow"
          className={classnames(classes.centerImg, { [classes.rotate]: right > 0 })}
        />
        <span className={classes.value}>
          {`${Math.abs(convertValue(right, 'length', 'ft'))} ${getUnitDisplay('length')} ${
            right > 0 ? 'Right' : 'Left'
          }`}
        </span>
      </div>
    ) : (
      '-'
    );
  }

  // Last Active for drilling & completion
  if (
    item.key === DRILLING_WELL_SUMMARY.LAST_ACTIVE.key ||
    item.key === COMPLETION_WELL_SUMMARY.LAST_ACTIVE.key
  ) {
    const { timestamp } = item.dataGetter(summaryData);
    return (
      <Typography className={classes.value}>
        {timestamp ? moment.unix(timestamp).format('MM/DD/YYYY HH:mm') : '-'}
      </Typography>
    );
  }

  // Last Current activity for drilling & completion
  if (
    item.key === DRILLING_WELL_SUMMARY.CURRENT_ACTIVITY.key ||
    item.key === COMPLETION_WELL_SUMMARY.CURRENT_ACTIVITY.key
  ) {
    const { activityName } = item.dataGetter(summaryData);
    return (
      <Typography className={classes.value}>{orDash(upperFirst(activityName || '-'))}</Typography>
    );
  }

  // Current phase for drilling
  if (item.key === DRILLING_WELL_SUMMARY.PHASE.key) {
    const { phaseName } = item.dataGetter(summaryData);
    return <Typography className={classes.value}>{orDash(phaseName)}</Typography>;
  }

  // Hole section for drilling
  if (item.key === DRILLING_WELL_SUMMARY.HOLE_SECTION.key) {
    const { sectionName } = item.dataGetter(summaryData);
    return <Typography className={classes.value}>{orDash(sectionName)}</Typography>;
  }

  // Mud for drilling and drillout
  if ([DRILLING_WELL_SUMMARY.MUD.key, DRILLOUT_WELL_SUMMARY.MUD.key].includes(item.key)) {
    const { mudType, mudDensity } = item.dataGetter(summaryData);
    return (
      <Typography className={classes.value}>
        {mudType || mudDensity ? (
          <>
            {mudType && `${mudType}, `}
            {mudDensity &&
              `${convertValue(mudDensity, 'density', 'ppg')} ${getUnitDisplay('density')}`}
          </>
        ) : (
          '-'
        )}
      </Typography>
    );
  }

  // NPT for drilling & completion
  if (item.key === DRILLING_WELL_SUMMARY.NPT.key || item.key === COMPLETION_WELL_SUMMARY.NPT.key) {
    const { nptType, startTime, endTime } = item.dataGetter(summaryData);

    return nptType && startTime && endTime ? (
      <div className={classes.nptRoot}>
        <div className={classes.rectIndicator} />
        <Typography className={classes.value}>
          {upperFirst(nptType)}: {((endTime - startTime) / 3600).fixFloat(1)} hr
        </Typography>
      </div>
    ) : (
      '-'
    );
  }

  // Operation summary for drilling & completion
  if (
    item.key === DRILLING_WELL_SUMMARY.OPERATIONS_SUMMARY.key ||
    item.key === COMPLETION_WELL_SUMMARY.OPERATIONS_SUMMARY.key
  ) {
    const { dateTime, summary } = item.dataGetter(summaryData);
    return (
      <Typography className={classes.value}>
        {dateTime ? moment.unix(dateTime).format('MM/DD/YYYY HH:mm') : '-'}
        <br />
        {summary}
      </Typography>
    );
  }

  // Stage for completion
  if (item.key === COMPLETION_WELL_SUMMARY.STAGE.key) {
    const { planned, actual } = item.dataGetter(summaryData);
    return actual && planned ? (
      <Typography className={classes.value}>
        <span className={classes.stageActual}>{actual}</span>
        <span>/</span>
        <span>{planned}</span>
        <span className={classes.stagePercent}>Stg {Math.floor((actual / planned) * 100)} %</span>
      </Typography>
    ) : (
      '-'
    );
  }

  // Fluids for completion
  if (item.key === COMPLETION_WELL_SUMMARY.FLUIDS.key) {
    const { fluids } = item.dataGetter(summaryData);
    return (
      <div>
        {fluids.length === 0
          ? '-'
          : fluids.map(({ type, amount, unit }) => (
            <Typography key={`${type}_${amount}`} className={classes.value}>
              <span className={classes.fluidProppantType}>{type} - </span>
              <span>{`${convertValue(amount, 'oil', unit)} ${getUnitDisplay('oil')}`}</span>
            </Typography>
            ))}
      </div>
    );
  }
  // Fluids for completion
  if (item.key === COMPLETION_WELL_SUMMARY.PROPPANTS.key) {
    const { proppants } = item.dataGetter(summaryData);
    return (
      <div>
        {proppants.length === 0
          ? '-'
          : proppants.map(({ type, amount, unit }) => (
            <Typography key={`${type}_${amount}`} className={classes.value}>
              <span className={classes.fluidProppantType}>{type} - </span>
              <span>{`${convertValue(amount, 'mass', unit)} ${getUnitDisplay('mass')}`}</span>
            </Typography>
            ))}
      </div>
    );
  }

  // Alert for drilling & completion
  if (
    item.key === DRILLING_WELL_SUMMARY.ALERT.key ||
    item.key === COMPLETION_WELL_SUMMARY.ALERT.key
  ) {
    const { decisionPath } = item.dataGetter(summaryData);
    return <Typography className={classes.value}>{orDash(decisionPath)}</Typography>;
  }

  // App annotation for drilling & completion
  if (
    item.key === DRILLING_WELL_SUMMARY.ANNOTATION.key ||
    item.key === COMPLETION_WELL_SUMMARY.ANNOTATION.key
  ) {
    const { firstName, lastName, profilePhoto, content } = item.dataGetter(summaryData);
    const fullName = `${firstName} ${lastName}`;
    const displayName = `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`;

    return content ? (
      <div className={classes.profileRoot}>
        <div
          className={classes.profile}
          style={{
            backgroundColor: `#${utils.getColorFromString(fullName)}`,
            backgroundImage: `url(${profilePhoto})`,
          }}
        >
          {profilePhoto ? null : displayName}
        </div>
        <Typography className={classes.value}>{content}</Typography>
      </div>
    ) : (
      '-'
    );
  }

  // BHA for drilling and drillout
  if ([DRILLING_WELL_SUMMARY.BHA.key, DRILLOUT_WELL_SUMMARY.BHA.key].includes(item.key)) {
    const isDrilloutItem = DRILLOUT_WELL_SUMMARY.BHA.key === item.key;
    const { bhaId, components } = item.dataGetter(summaryData);
    const stringBhaId = (bhaId && String(bhaId)) || '-';
    const schematic =
      (bhaId && schematicUtils.getBHASchematic(components || [], isDrilloutItem)) || [];
    return (
      <div className={classes.bhaRoot}>
        <div
          className={classnames(classes.bhaIdRoot, {
            [classes.realBhaRoot]: !stringBhaId.includes('.'),
          })}
        >
          <Typography
            className={classnames(classes.bhaIdLabel, {
              [classes.dummyBhaIdLabel]: stringBhaId.includes('.'),
            })}
          >
            {stringBhaId}
          </Typography>
        </div>
        <BHASchematic schematic={schematic} containerHeight={20} containerWidth={120} />
      </div>
    );
  }

  // Casing for drilling
  if (item.key === DRILLING_WELL_SUMMARY.CASING.key) {
    const { outerDiameter } = item.dataGetter(summaryData);
    if (!outerDiameter) {
      return null;
    }
    return (
      <Typography className={classes.value}>
        {`${convertValue(outerDiameter, 'shortLength', 'in')} ${getUnitDisplay('shortLength')}`}
      </Typography>
    );
  }

  if (item.key === DRILLING_WELL_SUMMARY.BHA_COUNT.key) {
    const { count } = item.dataGetter(summaryData);
    return <Typography className={classes.value}>{orDash(count)}</Typography>;
  }

  if (item.key === COMPLETION_WELL_SUMMARY.STAGES_DESIGN.key) {
    const { totalNumberOfStages } = item.dataGetter(summaryData);
    return Number.isFinite(totalNumberOfStages) ? (
      <Typography className={classes.value}>
        -/{totalNumberOfStages} <span className={classes.valueSuffix}>Stg</span>
      </Typography>
    ) : (
      '-'
    );
  }

  if (item.key === COMPLETION_WELL_SUMMARY.PLUGS_DRILLED_COUNT.key) {
    const { plugsDrilledCount } = item.dataGetter(summaryData);

    return Number.isFinite(plugsDrilledCount) ? (
      <div className={classes.valueWrapper}>
        <img src={DrilloutIcon} alt="drillout" className={classes.plugsIcon} />
        <span className={classnames(classes.value, classes.hasLeftMargin)}>
          {plugsDrilledCount}
        </span>
      </div>
    ) : (
      '-'
    );
  }

  if (process.env.NODE_ENV === 'development') {
    throw new Error(`${item.key} wasn't handled in WellSummaryItemValue. Returning null`);
  }

  return null;
}

WellSummaryItemValue.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.node,
    dataGetter: PropTypes.func,
  }).isRequired,
  summaryData: PropTypes.shape({}).isRequired,
};

export default WellSummaryItemValue;
