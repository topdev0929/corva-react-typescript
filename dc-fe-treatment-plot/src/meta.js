import { CORVA_PROVIDER } from './constants';

export const METADATA = {
  title: 'Treatment Plot',
  subtitle: 'Treatment Plot',
  provider: CORVA_PROVIDER,
  collections: {
    wits: 'completion.wits',
    wits10s: 'completion.wits.summary-10s',
    wits1m: 'completion.wits.summary-1m',
    predictions: 'completion.predictions',
    abra: 'completion.offset.abra',
    abraMetadata: 'completion.offset.abra.metadata',
    activities: 'completion.activity.summary-stage',
    goals: 'completion.data.job-settings',
    stageTimes: 'completion.stage-times',
    stagesData: 'completion.data.stages',
  },
};
