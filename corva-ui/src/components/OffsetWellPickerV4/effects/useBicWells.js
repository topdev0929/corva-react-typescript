import { useState, useEffect } from 'react';
import { isEmpty, get, uniq, intersection } from 'lodash';
import { fetchOffsetWellSelections, fetchWellhubWells } from '../utils/apiCalls';
import { ALL_SECTION_KEY, ALL_SECTION_LABEL, WellSectionColors } from '../constants';

export const useBicWells = (isWDUser, assetId, wells) => {
  const [wellSections, setWellSections] = useState(null);
  const [offsetWellsBySection, setOffsetWellsBySection] = useState(null);

  useEffect(() => {
    const fetchOffsetWellSelectionData = async () => {
      try {
        const data = assetId ? await fetchOffsetWellSelections(assetId) : [];
        const filters = !isEmpty(data) && JSON.parse(data[0].data.filters);
        const result = !isEmpty(data) && data[0].data.result && JSON.parse(data[0].data.result);

        if (filters && result) {
          const sections = filters.filterTabs.map((tab, index) => ({
            value: tab.value,
            label: tab.name,
            color: WellSectionColors[index],
          }));
          let allWellIds = [];
          let wellsData = sections.reduce((acc, { value }) => {
            const addedWellIds = uniq(result[value].concat(assetId));
            allWellIds = allWellIds.concat(addedWellIds);
            return { ...acc, [value]: addedWellIds };
          }, {});
          wellsData = { ...wellsData, [ALL_SECTION_KEY]: uniq(allWellIds) };

          // NOTE: Filter the removed offset wells
          const wellIds = wells.map(well => well.id);
          wellsData = Object.keys(wellsData).reduce(
            (acc, key) => ({ ...acc, [key]: intersection(wellsData[key], wellIds) }),
            {}
          );

          setWellSections([{ value: ALL_SECTION_KEY, label: ALL_SECTION_LABEL }, ...sections]);
          setOffsetWellsBySection(wellsData);
        } else {
          setWellSections([{ value: ALL_SECTION_KEY, label: ALL_SECTION_LABEL }]);
          setOffsetWellsBySection({ [ALL_SECTION_KEY]: [assetId] });
        }
      } catch (err) {
        console.error('offetwell selection fetch error: ', err);
        setWellSections([]);
        setOffsetWellsBySection([]);
      }
    };

    const fetchWellhubData = async () => {
      try {
        const record = await fetchWellhubWells(assetId);
        const offsetWells = get(record[0], 'data.offset_wells') || [];
        let offsetWellsBySection = {
          [ALL_SECTION_KEY]: uniq(offsetWells.map(({ id }) => id).concat(assetId)),
        };
        setWellSections([{ value: ALL_SECTION_KEY, label: ALL_SECTION_LABEL }]);

        // NOTE: Filter the removed offset wells
        const wellIds = wells.map(well => well.id);
        offsetWellsBySection = Object.keys(offsetWellsBySection).reduce(
          (acc, key) => ({ ...acc, [key]: intersection(offsetWellsBySection[key], wellIds) }),
          {}
        );

        setOffsetWellsBySection(offsetWellsBySection);
      } catch (err) {
        console.error('wellhub fetch error: ', err);
        setWellSections([]);
        setOffsetWellsBySection([]);
      }
    };

    if (assetId && wells) {
      if (isWDUser) {
        fetchOffsetWellSelectionData();
      } else {
        fetchWellhubData();
      }
    }
  }, [isWDUser, assetId, wells]);

  return [wellSections, setWellSections, offsetWellsBySection, setOffsetWellsBySection];
};
