import { useMemo, useEffect, useRef } from 'react';
import { shape, string, func, bool, arrayOf, number } from 'prop-types';
import classNames from 'classnames';
import { get, maxBy } from 'lodash';
import uuid from 'uuid';

import Track from './components/Track';
import CursorPositioner from './components/Tooltip/CursorPositioner';

import { SETTINGS_KEY, DEFAULT_TRACK_SETTINGS } from './constants';

import { convertData } from './utils/dataParser';

import SettingsContext from './SettingsContext';
import DataContext from './DataContext';

import styles from './ParameterCharts.css';
import ChartsContext from './ChartsContext';

const ParameterCharts = ({
  settings,
  onSettingsChange,
  settingsKey,
  horizontal,
  mapping,
  data,
  indexes,
  isLoading,
  multipleAssets,
  assestColors,
}) => {
  const currentSettings = settings[settingsKey];

  const chartsRef = useRef(new Map());

  const onChartChange = (id, chartRef) => {
    chartsRef.current.set(id, chartRef);
  };

  // TODO: move to utils
  // TODO: move types to files?
  // TODO: async data calculation
  // TODO: fix the vertical view
  // TODO: update data by higcharts API

  useEffect(() => {
    if (!currentSettings || !currentSettings.length) {
      onSettingsChange({
        ...settings,
        [settingsKey]: [
          {
            ...DEFAULT_TRACK_SETTINGS,
            id: uuid(),
          },
        ],
      });
    }
  }, []);

  const maxTracesCount = useMemo(
    () => get(maxBy(currentSettings, 'traces.length'), 'traces.length') || 1,
    [currentSettings]
  );

  const parsedData = useMemo(() => {
    if (multipleAssets) {
      const assetsKeys = Object.keys(data);

      return assetsKeys.reduce(
        (acc, assetKey) => ({
          ...acc,
          [assetKey]: convertData({ data: data[assetKey], mapping, indexesKeys: indexes.keys }),
        }),
        {}
      );
    } else {
      return convertData({ data, mapping, indexesKeys: indexes.keys });
    }
  }, [data, mapping, indexes.keys, multipleAssets]);

  return (
    <SettingsContext.Provider
      value={{
        horizontal,
        settingsKey,
        settings,
        onSettingsChange,
        maxTracesCount,
        multipleAssets,
        assestColors,
      }}
    >
      <DataContext.Provider
        value={{
          mapping,
          parsedData,
          indexes,
          isLoading,
        }}
      >
        <ChartsContext.Provider
          value={{
            chartsRef,
            onChartChange,
          }}
        >
          <div className={classNames(styles.container, { [styles.horizontal]: horizontal })}>
            <CursorPositioner />
            {currentSettings &&
              currentSettings.map((trackSettings, index) => (
                <Track
                  key={trackSettings.id}
                  settings={settings}
                  onSettingsChange={onSettingsChange}
                  id={trackSettings.id}
                  index={index}
                />
              ))}
          </div>
        </ChartsContext.Provider>
      </DataContext.Provider>
    </SettingsContext.Provider>
  );
};

ParameterCharts.propTypes = {
  data: shape({}).isRequired,
  mapping: arrayOf(
    shape({
      name: string.isRequired,
      key: string.isRequired,
      unit: string.isRequired,
      unitType: string.isRequired,
    }).isRequired
  ).isRequired,
  indexes: shape({
    key: string,
    name: string,
    min: number,
    max: number,
    unit: string,
    unitType: string,
  }).isRequired,
  settingsKey: string,
  settings: shape({}),
  onSettingsChange: func.isRequired,
  horizontal: bool,
  multipleAssets: bool,
  isLoading: bool.isRequired,
  assestColors: arrayOf(string)
};

ParameterCharts.defaultProps = {
  settingsKey: SETTINGS_KEY,
  horizontal: false,
  multipleAssets: false,
  settings: {},
  assestColors: []
};

export default ParameterCharts;
