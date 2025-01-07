import { useEffect, useRef, useState } from 'react';
import { chain, flatMap, groupBy, isEqual, mapValues, lowerFirst } from 'lodash';
import { showErrorNotification } from '@corva/ui/utils';

import {
  fetchPhasePicklist,
  getCriticalPoints,
  getManualPhases,
  postCriticalPoint,
  postManualPhase,
  putManualPhase,
  delManualPhase,
  delCriticalPoint,
  putCriticalPoint,
} from '~/api/phases';
import { fetchWitsData } from '~/api/wits';
import { parseCriticalPoint } from '~/utils/phases';
import { SOURCE_TYPE } from '~/constants';

export function usePhases(provider, companyId, assetId, appSettings, onAppSettingChange) {
  const [phaseList, setPhaseList] = useState([]);
  const [isPhasesLoaded, setIsPhasesLoaded] = useState(false);
  const [manualPhases, setManualPhases] = useState([]);
  const [selectedPhases, setSelectedPhases] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [isPhaseRefresh, setIsPhaseRefresh] = useState(true);
  const allPhasesById = useRef({});
  const [criticalPoints, setCriticalPoints] = useState([]);
  const allCriticalPoints = useRef();
  const [isCriticalRefresh, setIsCriticalRefresh] = useState(true);
  const prevSelectedPhases = useRef();
  const prevSelectedZones = useRef();
  const [filteredPoints, setFilteredPoints] = useState([]);

  // NOTE: Fetch Phase Picklist
  useEffect(() => {
    async function fetchPhaseTags() {
      const picklists = await fetchPhasePicklist();
      setPhaseList(picklists);
    }

    fetchPhaseTags();
  }, []);

  useEffect(() => {
    setIsPhaseRefresh(true);
    setIsCriticalRefresh(true);
  }, [assetId]);

  // NOTE: Manual Phases
  const saveManualPhase = async record => {
    let result;
    const newRecord = {
      version: 1,
      company_id: companyId,
      timestamp: Math.round(new Date().getTime() / 1000),
      ...record,
    };
    if (!record?.id) {
      result = await postManualPhase(provider, [newRecord]);
      result = {
        _id: result.inserted_ids[0],
        ...newRecord,
      };
    } else {
      const response = await putManualPhase(provider, record.id, newRecord);
      result = response?.[0];
    }

    setIsPhaseRefresh(true);

    return result;
  };

  const updateManualPhase = async (newPhase, prevPhase) => {
    const phaseId = newPhase.id.replace(/_.*$/, '');
    const record = allPhasesById.current[phaseId];
    record.data.phases = record.data.phases.map(item =>
      item.start_time === prevPhase.start_time
        ? {
            phase_name: newPhase.name,
            color: newPhase.color,
            zone: newPhase.zone,
            start_time: newPhase.start_time,
            end_time: newPhase.end_time,
          }
        : item
    );
    const newRecord = {
      version: 1,
      company_id: companyId,
      timestamp: Math.round(new Date().getTime() / 1000),
      ...record,
    };

    await putManualPhase(provider, phaseId, newRecord);
    setIsPhaseRefresh(true);
  };

  const deleteManualPhase = async (deletePhase, prevPhase) => {
    const deletingId = deletePhase.id.replace(/_.*$/, '');
    const record = allPhasesById.current[deletingId];

    if (record.data.phases.length > 1) {
      record.data.phases = record.data.phases.filter(
        item => item.start_time !== prevPhase.start_time
      );
      const newRecord = {
        version: 1,
        company_id: companyId,
        timestamp: Math.round(new Date().getTime() / 1000),
        ...record,
      };
      await putManualPhase(provider, deletingId, newRecord);
    } else {
      await delManualPhase(provider, deletingId);
    }

    setIsPhaseRefresh(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getManualPhases(provider, assetId);
      const transformedData = data.reduce((result, item) => {
        const { phases } = item.data;
        phases
          .filter(phase => phase.end_time != null)
          .forEach((phase, idx) => {
            const phaseName = phase.phase_name;
            if (!result[phaseName]) {
              // eslint-disable-next-line no-param-reassign
              result[phaseName] = [];
            }
            result[phaseName].push({
              // eslint-disable-next-line no-underscore-dangle
              id: `${item._id}_${idx}`,
              name: phase.phase_name,
              color: phase.color,
              zone: phase.zone,
              start_time: phase.start_time,
              end_time: phase.end_time,
            });
          });
        return result;
      }, {});

      setManualPhases(transformedData);
      setIsPhasesLoaded(true);
      allPhasesById.current = mapValues(groupBy(data, '_id'), arr => arr[0]);
      setIsPhaseRefresh(false);
    };

    if (assetId && isPhaseRefresh) {
      fetchData();
    }
  }, [provider, assetId, isPhaseRefresh]);

  useEffect(() => {
    if (!isPhasesLoaded || !prevSelectedPhases.current) return;

    if (selectedPhases.length > 0) {
      const allPhasesName = Object.keys(manualPhases);
      const newSelectedPhases = selectedPhases.filter(item => allPhasesName.includes(item));
      if (!isEqual(newSelectedPhases, selectedPhases)) {
        setSelectedPhases(newSelectedPhases);
        prevSelectedPhases.current = newSelectedPhases;
      }
    }
  }, [isPhasesLoaded, manualPhases, selectedPhases]);

  useEffect(() => {
    if (!isPhasesLoaded || !prevSelectedZones.current) return;

    if (selectedZones.length > 0) {
      const flattedMap = flatMap(manualPhases);
      const zones = chain(flattedMap).map('zone').sort().uniq().value();
      const newSelectedZones = selectedZones.filter(item => zones.includes(item));
      if (!isEqual(newSelectedZones, selectedZones)) {
        setSelectedZones(newSelectedZones);
        prevSelectedZones.current = newSelectedZones;
      }
    }
  }, [isPhasesLoaded, manualPhases, selectedZones]);

  // NOTE: Update AppSettigns
  useEffect(() => {
    if (!isPhasesLoaded) return;

    if (!prevSelectedZones.current) {
      setSelectedZones(appSettings?.filtered_zones || []);
      prevSelectedZones.current = appSettings?.filtered_zones || [];
    } else if (!isEqual(prevSelectedZones.current, selectedZones)) {
      onAppSettingChange('filtered_zones', selectedZones);
      prevSelectedZones.current = selectedZones;
    }
  }, [selectedZones, isPhasesLoaded]);

  useEffect(() => {
    if (!isPhasesLoaded) return;

    if (!prevSelectedPhases.current) {
      setSelectedPhases(appSettings?.filtered_phases ?? []);
      prevSelectedPhases.current = appSettings?.filtered_phases ?? [];
    } else if (!isEqual(prevSelectedPhases.current, selectedPhases)) {
      onAppSettingChange('filtered_phases', selectedPhases);
      prevSelectedPhases.current = selectedPhases;
    }
  }, [selectedPhases, isPhasesLoaded]);

  // NOTE: Critical Points
  const saveCriticalPoint = async record => {
    const data = {
      color: record.data.color,
      timestamp: record.data.timestamp,
      title: record.data.title,
      user: record.data.user,
      trace: record.data?.sensor_id
        ? lowerFirst(record.data.trace.split(' | ')[0])
        : record.data.trace,
    };
    const newRecord = [
      {
        ...record,
        version: 1,
        company_id: companyId,
        timestamp: Math.round(new Date().getTime() / 1000),
        data,
      },
    ];
    try {
      const result = await postCriticalPoint(provider, newRecord);
      setCriticalPoints(prev =>
        prev.concat(parseCriticalPoint({ _id: result.inserted_ids[0], ...record }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAndValidateWitsData = async (assetId, trace, startTime, endTime) => {
    const data = await fetchWitsData(
      SOURCE_TYPE.low,
      assetId,
      [{ traceName: trace }],
      startTime,
      endTime
    );
    return data?.length > 0;
  };

  const checkIfExistsOnMiddleWitsData = async (assetId, trace, timestamp) => {
    const witsDataRight = await fetchAndValidateWitsData(assetId, trace, timestamp, timestamp + 10);
    const witsDataLeft = await fetchAndValidateWitsData(assetId, trace, timestamp - 10, timestamp);
    return witsDataLeft && witsDataRight;
  };

  const updateCriticalPoints = async newPoints => {
    const filtered = newPoints.filter(point => {
      const matchedItem = criticalPoints.find(_ => _.id === point.id);
      return matchedItem.timestamp !== point.timestamp;
    });
    const requests = filtered.map(async point => {
      try {
        if (allCriticalPoints.current[point.id]) {
          const record = {
            ...allCriticalPoints.current[point.id],
            version: 1,
            company_id: companyId,
            timestamp: Math.round(new Date().getTime() / 1000),
            data: {
              title: point.title,
              color: point.color,
              trace: point.trace,
              timestamp: point.timestamp,
              user: point.user,
            },
          };
          if (point.trace === 'pressure' || point.trace === 'temperature') {
            await putCriticalPoint(provider, point.id, record);
          } else {
            const validOnMiddle = await checkIfExistsOnMiddleWitsData(
              record.asset_id,
              record.data.trace,
              record.data.timestamp
            );

            if (!validOnMiddle) {
              const witsDataAround = await fetchAndValidateWitsData(
                record.asset_id,
                record.data.trace,
                record.data.timestamp - 1,
                record.data.timestamp + 1
              );
              if (witsDataAround) await putCriticalPoint(provider, point.id, record);
              else showErrorNotification('There is no wits data on selected point.');
            } else {
              await putCriticalPoint(provider, point.id, record);
            }
          }
        } else {
          showErrorNotification('The selected critical point cannot be moved.');
        }
      } catch (err) {
        console.error(err);
      }
    });
    await Promise.all(requests);
    setIsCriticalRefresh(true);
  };

  const updateCriticalPoint = async (updatingId, data) => {
    const record = {
      asset_id: assetId,
      version: 1,
      company_id: companyId,
      timestamp: Math.round(new Date().getTime() / 1000),
      data,
    };
    await putCriticalPoint(provider, updatingId, record);
    setIsCriticalRefresh(true);
  };

  const deleteCriticalPoint = async deletingId => {
    await delCriticalPoint(provider, deletingId);
    setIsCriticalRefresh(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const points = await getCriticalPoints(provider, assetId);
      allCriticalPoints.current = mapValues(groupBy(points, '_id'), arr => arr[0]);
      const parsedData = points.map(parseCriticalPoint);
      setCriticalPoints(parsedData);
      setIsCriticalRefresh(false);
    };

    if (assetId && isCriticalRefresh) {
      fetchData();
    }
  }, [provider, assetId, isCriticalRefresh]);

  return [
    phaseList,
    manualPhases,
    selectedPhases,
    setSelectedPhases,
    selectedZones,
    setSelectedZones,
    saveManualPhase,
    updateManualPhase,
    deleteManualPhase,
    criticalPoints,
    saveCriticalPoint,
    updateCriticalPoints,
    updateCriticalPoint,
    deleteCriticalPoint,
    filteredPoints,
    setFilteredPoints,
  ];
}
