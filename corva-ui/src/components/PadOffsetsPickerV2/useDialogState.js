import { useReducer, useEffect, useState, useMemo } from 'react';
import { get, isEmpty } from 'lodash';
import Jsona from 'jsona';

import { getPads } from '~/clients/jsonApi';

const dataFormatter = new Jsona();

const initialState = {
  status: 'idle',
  padsData: [],
  wellsData: [],
  lastStage: [],
  error: null,
  companyId: 0,
  selectedPadsData: [],
};

function reducer(requestState, action) {
  switch (action.type) {
    case 'FETCH_PADS':
      return { ...requestState, status: 'pending', target: 'FETCH_PADS' };
    case 'PADS_REQUEST_SUCCESS':
      return { ...requestState, status: 'success', target: '', padsData: action.filteredPads };
    case 'GET_WELLS':
      return { ...requestState, status: 'success', target: 'GET_WELLS' };
    case 'WELLS_REQUEST_SUCCESS':
      return { ...requestState, status: 'success', target: '', wellsData: action.wellsData };
    case 'FAILURE':
      return { ...requestState, status: 'failure', error: action.error };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function fetchPadsAction({ dispatch, companyId }) {
  getPads({
    fields: ['pad.name', 'pad.wells'],
    sort: 'name',
    per_page: 1000,
    company: companyId,
  })
    .then(result => dataFormatter.deserialize(result))
    .then(result => result.filter(pad => !isEmpty(get(pad, 'wells'))))
    .then(filteredPads => dispatch({ type: 'PADS_REQUEST_SUCCESS', filteredPads }))
    .catch(error => dispatch({ type: 'FAILURE', error }));
}

function getWellsAction({ dispatch, selectedPadsData }) {
  const wellsData = selectedPadsData.reduce((result, padData) => {
    return result.concat(padData.wells);
  }, []);

  dispatch({ type: 'WELLS_REQUEST_SUCCESS', wellsData });
}

export function useDialogState({ opened, companyId, currentOffsetSetting, assets }) {
  const [requestState, dispatch] = useReducer(reducer, initialState);
  const [dialogState, setDialogState] = useState({
    selectedPadIds: [],
    selectedWellIds: [],
    status: 'closed',
  });

  const currentOffsetIds = useMemo(
    () =>
      isEmpty(currentOffsetSetting) && !isEmpty(assets)
        ? assets.map(asset => asset.asset_id)
        : currentOffsetSetting.map(offset => offset.selectedWellId),
    [currentOffsetSetting, assets]
  );

  useEffect(() => {
    requestState.companyId = companyId;
    dispatch({ type: 'FETCH_PADS' });
  }, []);

  useEffect(() => {
    if (requestState.target === 'FETCH_PADS') {
      fetchPadsAction({ dispatch, companyId: requestState.companyId });
    } else if (requestState.target === 'GET_WELLS') {
      getWellsAction({ dispatch, selectedPadsData: requestState.selectedPadsData });
    }
  }, [requestState.target]);

  useEffect(() => {
    if (!isEmpty(dialogState.selectedPadIds)) {
      const selectedPadsData = requestState.padsData.filter(pad =>
        dialogState.selectedPadIds.includes(pad.id)
      );
      requestState.selectedPadsData = selectedPadsData;
      dispatch({ type: 'GET_WELLS' });
    }
  }, [dialogState.selectedPadIds]);

  useEffect(() => {
    if (opened) {
      const currentPadIds = [];

      if (!isEmpty(currentOffsetIds)) {
        requestState.padsData.forEach(pad => {
          pad.wells.forEach(well => {
            if (currentOffsetIds.includes(well.asset_id) && !currentPadIds.includes(pad.id)) {
              currentPadIds.push(pad.id);
            }
          });
        });
      }

      setDialogState(prev => ({
        ...prev,
        selectedPadIds: currentPadIds,
        selectedWellIds: currentOffsetIds,
        status: 'open',
      }));
    }
  }, [opened]);

  return { requestState, dialogState, setDialogState };
}
