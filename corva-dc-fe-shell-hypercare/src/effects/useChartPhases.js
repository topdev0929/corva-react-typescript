import { useEffect, useMemo, useRef, useState } from 'react';
import { cloneDeep, get } from 'lodash';
import { checkPhaseOverlapped, checkCurrentPhaseOverlapped } from '~/utils/phases';
import { DEFAULT_PHASE_COLOR, PHASE_DIALOG_TYPE } from '~/constants';

export function useChartPhases({
  chart,
  assetId,
  saveManualPhase,
  setActivePhase,
  updateManualPhase,
  deleteManualPhase,
  manualPhases,
  filteredPhases,
  setPhaseTooltip,
  clientRect,
  timeRange,
  invisibleLegends,
  setIsContextMenuOpen,
  setErrorMsgOpen,
  panningTime,
}) {
  const [addingPhase, setAddingPhase] = useState(null);
  const [addedGeoPhases, setAddedGeoPhases] = useState([]);
  const [phaseDialogType, setPhaseDialogType] = useState(PHASE_DIALOG_TYPE.close);
  const [editingPhase, setEditingPhase] = useState(null);
  const [dbRecordId, setDbRecordId] = useState(null);
  const prevUpdatePhase = useRef();

  const visiblePhases = useMemo(() => {
    return filteredPhases.filter(phase => !invisibleLegends.includes(phase.name));
  }, [filteredPhases, invisibleLegends]);

  const savePhase = async phasesToSave => {
    const record = {
      id: dbRecordId,
      asset_id: assetId,
      data: {
        phases: phasesToSave.map(phase => ({
          phase_name: phase.name,
          color: phase.color,
          zone: phase.zone,
          start_time: phase.start_time,
          end_time: phase.end_time,
        })),
      },
    };
    const result = await saveManualPhase(record);
    return result;
  };

  const checkValidatePhase = () => {
    const { timestamp } = addingPhase;
    const prevStartTime = addedGeoPhases?.[addedGeoPhases.length - 1]?.start_time ?? timestamp;

    const oldDataOverlapped = checkPhaseOverlapped(manualPhases, [prevStartTime, timestamp]);
    const currentDataOverlapped = checkCurrentPhaseOverlapped(addedGeoPhases, timestamp);
    if (timestamp < prevStartTime || oldDataOverlapped || currentDataOverlapped) {
      setIsContextMenuOpen(false);
      setPhaseDialogType(PHASE_DIALOG_TYPE.close);
      setErrorMsgOpen(true);
      return false;
    }
    return true;
  };

  const handleClickStartPhase = () => {
    if (!checkValidatePhase()) return;
    setIsContextMenuOpen(false);
    setPhaseDialogType(PHASE_DIALOG_TYPE.create);
  };

  const handleClosePhaseDialog = () => {
    setPhaseDialogType(PHASE_DIALOG_TYPE.close);
  };

  const handleAddNewPhase = async newPhase => {
    setPhaseDialogType(PHASE_DIALOG_TYPE.close);

    const startTime = addingPhase.timestamp;
    const newPhases = addedGeoPhases.concat({
      ...newPhase,
      start_time: startTime,
      end_time: null,
      circle: addingPhase,
    });

    if (addedGeoPhases.length > 0) {
      newPhases[addedGeoPhases.length - 1].end_time = startTime;
      const savedPhases = await savePhase(newPhases);
      setDbRecordId(get(savedPhases, '_id'));
    }
    setActivePhase(newPhase.name);
    setAddedGeoPhases(newPhases);
  };

  const handleClickEndPhase = async () => {
    if (!checkValidatePhase()) return;
    if (addedGeoPhases.length === 0) {
      setIsContextMenuOpen(false);
      setErrorMsgOpen(true);
      return;
    }

    setIsContextMenuOpen(false);
    setPhaseDialogType(PHASE_DIALOG_TYPE.close);

    const clonedPhases = cloneDeep(addedGeoPhases);
    clonedPhases[addedGeoPhases.length - 1].end_time = addingPhase.timestamp;

    await savePhase(clonedPhases);
    setActivePhase(clonedPhases[clonedPhases.length - 1].name);
    setAddedGeoPhases([]);
    setDbRecordId(null);
  };

  const handleEditPhaseModalOpen = async phase => {
    setEditingPhase(phase);
    setIsContextMenuOpen(false);
    setPhaseDialogType(PHASE_DIALOG_TYPE.edit);
    prevUpdatePhase.current = phase;
  };

  const handleEditPhase = async updatedPhase => {
    setPhaseDialogType(PHASE_DIALOG_TYPE.close);
    updateManualPhase(updatedPhase, prevUpdatePhase.current);
  };

  const handleDeletePhase = async deletePhase => {
    setPhaseDialogType(PHASE_DIALOG_TYPE.close);
    deleteManualPhase(deletePhase, prevUpdatePhase.current);
  };

  const handlePhaseHoverIn = (phase, event) => {
    const shape = document.getElementById(`hypercare-phase-${phase.id}`);
    const rect = shape.getBoundingClientRect();

    setPhaseTooltip({
      x: event.clientX - clientRect.left,
      y: rect.top - clientRect.top,
      phase,
    });
  };

  const handleHoverOut = () => {
    setPhaseTooltip(null);
  };

  useEffect(() => {
    if (!chart?.xAxis) return;

    const { plotLeft, plotWidth, plotHeight } = chart;
    const { min, max } = chart?.xAxis?.[0] ?? { min: 0, max: 0 };

    visiblePhases.forEach(phase => {
      const startTime = Math.max(phase.start_time, min);
      const endTime = Math.min(phase.end_time ?? Infinity, max);
      const x = plotLeft + (plotWidth * (startTime - min)) / (max - min);
      const w = (plotWidth * (endTime - startTime)) / (max - min);
      const rect = chart.renderer
        .rect(x, plotHeight + 10, w, 10, 5)
        .attr({
          id: `hypercare-phase-${phase.id}`,
          fill: phase.color ?? DEFAULT_PHASE_COLOR,
        })
        .on('click', () => handleEditPhaseModalOpen(phase))
        .on('mouseover', event => handlePhaseHoverIn(phase, event))
        .on('mouseout', handleHoverOut);
      rect?.add();
    });
  }, [visiblePhases, chart, clientRect, timeRange, invisibleLegends]);

  useEffect(() => {
    if (!panningTime) return;

    const { plotLeft, plotWidth } = chart;
    const { min, max } = panningTime;
    visiblePhases.forEach(phase => {
      const startTime = Math.max(phase.start_time, min);
      const endTime = Math.min(phase.end_time ?? Infinity, max);
      const x = plotLeft + (plotWidth * (startTime - min)) / (max - min);
      const w = (plotWidth * (endTime - startTime)) / (max - min);
      const phaseEl = document.getElementById(`hypercare-phase-${phase.id}`);
      phaseEl?.setAttribute('x', x);
      phaseEl?.setAttribute('width', w);
    });
  }, [chart, visiblePhases, panningTime]);

  return {
    phaseDialogType,
    editingPhase,
    addingPhase,
    setAddingPhase,
    addedGeoPhases,
    setAddedGeoPhases,
    handleClickStartPhase,
    handleClickEndPhase,
    handleAddNewPhase,
    handleEditPhase,
    handleDeletePhase,
    handleClosePhaseDialog,
  };
}
