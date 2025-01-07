import { useState } from 'react';
import { AppHeader, LoadingIndicator, SwitchControl } from '@corva/ui/components';

import { AppSettings, CommonAppProps } from './types';
import { DEFAULT_SETTINGS } from './constants';
import TimeRangeEditor from './components/TimeRangeEditor';
import WellStagesList from './components/WellStagesList';
import Metrics from './components/Metrics';
import AppStatusBadge from './components/StatusBadge';
import useAppWells from './effects/useAppWells';
import useHistoricalAppData from './effects/useWellHistoricalData';
import useScoresInTimeRange from './effects/useTargetStages';
import useAppSettings from './effects/useAppSettings';
import logo from './assets/logo.svg';
import Settings from './components/Settings';
import useDesignValues from './effects/useDesignValues';
import CalculationLoading from './components/CalculationLoading';

import styles from './App.css';

type AppProps = AppSettings & CommonAppProps;

function App(props: AppProps): JSX.Element {
  const {
    metricsFunction = DEFAULT_SETTINGS.metricsFunction,
    timeRangeSettings = DEFAULT_SETTINGS.timeRange,
    onSettingChange,
    appHeaderProps,
    well,
    wells,
    fracFleet,
    padId,
    settingsByAsset,
    coordinates: { pixelWidth },
  } = props;

  const [recalculate, setRecalculate] = useState(false);
  const assetIds = wells.map(well => well.asset_id);
  const currentWells = useAppWells(well, fracFleet, wells, padId, settingsByAsset);

  const { data, isLoading } = useHistoricalAppData(currentWells, recalculate, setRecalculate);
  const filteredScores = useScoresInTimeRange(timeRangeSettings, data);
  const [appMetricsFunction, setAppMetricsFunction] = useState(metricsFunction);
  const [appTimeSettings, setAppTimeSettings] = useState(timeRangeSettings);
  const { appPadOrderSetting, onAppPadOrderSettingChange } = useAppSettings(props);
  const [isCalculating, setIsCalculating] = useState(false);
  const { designValues, setDesignValues, basinValue, companyId, isDesignValuesLoading } =
    useDesignValues(currentWells[0]?.asset_id, +fracFleet.id);

  return (
    <div className={styles.container}>
      <AppHeader {...appHeaderProps} logoSrc={logo} />
      {isLoading || isDesignValuesLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <div className={styles.filterContainer}>
            <div className={styles.filtersControls}>
              <TimeRangeEditor
                setting={appTimeSettings}
                onSettingChange={value => {
                  setAppTimeSettings(value);
                  onSettingChange('timeRangeSettings', value);
                }}
              />
              <div className={styles.actionContainer}>
                <SwitchControl
                  leftLabel="Average"
                  rightLabel="Sum"
                  checked={appMetricsFunction === 'sum'}
                  onChange={e => {
                    const value = e.target.checked ? 'sum' : 'avg';
                    setAppMetricsFunction(value);
                    onSettingChange('metricsFunction', value);
                  }}
                />
                <Settings
                  assetIds={assetIds}
                  assetName={currentWells[0].name}
                  fracFleetId={+fracFleet.id}
                  designValues={designValues}
                  basin={basinValue}
                  companyId={companyId}
                  setRecalculate={setRecalculate}
                  setIsCalculating={setIsCalculating}
                  setDesignValues={setDesignValues}
                />
              </div>
            </div>
            <Metrics
              scores={filteredScores}
              metricsFunction={metricsFunction}
              designRate={designValues.designRate}
              pixelWidth={pixelWidth}
            />
          </div>
          <div className={styles.content}>
            <WellStagesList
              wells={currentWells}
              stageData={data}
              designRate={designValues.designRate}
              designPressure={designValues.designPressure}
              orderSetting={appPadOrderSetting}
              onOrderSettingChange={onAppPadOrderSettingChange}
            />
          </div>
          <div className={styles.appStatusBadgeWrapper}>
            <AppStatusBadge currentAsset={currentWells[0]} />
          </div>
        </>
      )}
      {isCalculating && (
        <div className={styles.calculatingLoading}>
          <CalculationLoading />
        </div>
      )}
    </div>
  );
}

// Important: Do not change root component default export (App.js). Use it as container
//  for your App. It's required to make build and zip scripts work as expected;
export default App;
