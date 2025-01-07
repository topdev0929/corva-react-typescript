export const SET_ANNOTATIONS = 'SET_ANNOTATIONS';
export const APPEND_ANNOTATIONS = 'APPEND_ANNOTATIONS';
export const ADD_ANNOTATION = 'ADD_ANNOTATION';
export const DELETE_ANNOTATION = 'DELETE_ANNOTATION';
export const EDIT_ANNOTATION = 'EDIT_ANNOTATION';

export const ANNOTATION_ACTIVE_PERIODS = {
  '24h': { label: 'Next 24 hrs', time: { amount: 24, key: 'h' } },
  '12h': { label: 'Next 12 hrs', time: { amount: 12, key: 'h' } },
  '48h': { label: 'Next 48 hrs', time: { amount: 48, key: 'h' } },
  forever: { label: 'Forever' },
};
