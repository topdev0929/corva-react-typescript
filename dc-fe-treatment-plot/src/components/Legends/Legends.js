import PropTypes from 'prop-types';
import get from 'lodash/get';
import classNames from 'classnames';

import { withTheme } from '@material-ui/core';

import { completion as completionConstants } from '@corva/ui/constants';
import { useAppContext } from '@/context/AppContext';

const { ACTIVITIES } = completionConstants;

import './Legends.css';
import { TARGET_RAMP_ITEM } from '@/constants';

function ChartLegend(props) {
  const { theme, legendItem, legendSetting, handleClickLegend } = props;
  const disabledColor = '#666';
  const defaultTextColor = theme.isLightTheme ? '#000' : '#BDBDBD';

  const activityDisabled = !get(legendSetting, ['selected', legendItem.name], true);

  const barStyle = {
    backgroundColor: activityDisabled ? disabledColor : legendItem.color,
  };

  const textStyle = {
    color: activityDisabled ? disabledColor : defaultTextColor,
  };

  return (
    <div
      key={legendItem.name}
      className="tpLegendsItem"
      onClick={() => handleClickLegend(legendItem.name)}
    >
      <div className="tpLegendsItemColorcircle" style={barStyle} />
      <div style={textStyle}>{legendItem.name}</div>
    </div>
  );
}
ChartLegend.propTypes = {
  legendItem: PropTypes.shape({
    name: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  legendSetting: PropTypes.shape({}).isRequired,
  theme: PropTypes.shape({
    isLightTheme: PropTypes.bool,
  }).isRequired,
  handleClickLegend: PropTypes.func.isRequired,
};

function ActivityLegend(props) {
  const { legendItem, theme, legendSetting, disabled, handleClickLegend } = props;
  const disabledColor = '#666';
  const defaultTextColor = theme.isLightTheme ? '#000' : '#BDBDBD';

  const activityDisabled = legendSetting.find(item => item === legendItem.name);

  const extraBarStyle =
    (activityDisabled ? legendItem.barStyleDisabled : legendItem.barStyle) || {};
  const barStyle = {
    backgroundColor: activityDisabled ? disabledColor : legendItem.color,
    ...extraBarStyle,
  };

  const textStyle = {
    color: activityDisabled ? disabledColor : defaultTextColor,
  };

  return (
    <div
      key={legendItem.name}
      className={classNames('tpLegendsItem', disabled && 'disabled')}
      onClick={() => handleClickLegend(legendItem)}
    >
      <div className="tpLegendsItemColorbar" style={barStyle} />
      <div style={textStyle}>{legendItem.name}</div>
    </div>
  );
}
ActivityLegend.propTypes = {
  legendItem: PropTypes.shape({
    name: PropTypes.string,
    color: PropTypes.string,
    barStyle: PropTypes.shape({}),
    barStyleDisabled: PropTypes.shape({}),
  }).isRequired,
  disabled: PropTypes.bool,
  legendSetting: PropTypes.arrayOf(PropTypes.string).isRequired,
  theme: PropTypes.shape({
    isLightTheme: PropTypes.bool,
  }).isRequired,
  handleClickLegend: PropTypes.func.isRequired,
};

function Legends(props) {
  const { setting, theme, legend, onLegendChange, onSettingChange, hasRamp } = props;
  const { isAssetViewer } = useAppContext();

  const handleClickActivity = activity => {
    const foundIndex = setting.findIndex(item => item === activity.name);
    const newSetting =
      foundIndex === -1
        ? [...setting, activity.name]
        : setting.filter(item => item !== activity.name);

    onSettingChange(newSetting);
  };

  const handleClickLegend = clickedLegendName => {
    const newLegendSelected = legend.data.reduce((result, { name: legendName }) => {
      const legendSetting = get(legend, ['selected', legendName], true);
      return {
        ...result,
        [legendName]: clickedLegendName === legendName ? !legendSetting : legendSetting,
      };
    }, {});
    const newLegend = {
      ...legend,
      selected: newLegendSelected,
    };
    onLegendChange(newLegend);
  };
  const legendData = legend.data;

  return (
    <div className="tpLegends">
      {legendData.map(legendItem => (
        <ChartLegend
          key={legendItem.name}
          theme={theme}
          legendItem={legendItem}
          legendSetting={legend}
          handleClickLegend={handleClickLegend}
        />
      ))}
      {hasRamp && (
        <ActivityLegend
          key={TARGET_RAMP_ITEM}
          theme={theme}
          legendItem={TARGET_RAMP_ITEM}
          legendSetting={setting.includes(TARGET_RAMP_ITEM.name) ? [] : [TARGET_RAMP_ITEM.name]}
          handleClickLegend={handleClickActivity}
        />
      )}
      {!isAssetViewer &&
        ACTIVITIES.map(activity => (
          <ActivityLegend
            key={activity.name}
            theme={theme}
            legendItem={activity}
            legendSetting={setting}
            handleClickLegend={handleClickActivity}
          />
        ))}
    </div>
  );
}

Legends.propTypes = {
  legend: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  hasRamp: PropTypes.bool,
  setting: PropTypes.arrayOf(PropTypes.string).isRequired,
  theme: PropTypes.shape({}).isRequired,
  onLegendChange: PropTypes.func.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default withTheme(Legends);
