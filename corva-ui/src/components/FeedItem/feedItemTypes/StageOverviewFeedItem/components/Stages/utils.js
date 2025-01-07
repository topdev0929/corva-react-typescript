import { get, isEmpty } from 'lodash';
import { getStageSummary } from '~/utils/StageDesignVActualUtils';

export const getSummaries = (data, stagesData, predictionsData) => {
  const startSummary = {
    top_perforation: data.data?.top_perforation,
    bottom_perforation: data.data?.bottom_perforation,
    perforated_length: 0,
    total_shots: 0,
    flush_volume: 0,
    fluids: {},
    chemicals: {},
    proppants: {},
  };

  const predictionSummary = {
    ...predictionsData,
    flush_volume_design: get(predictionsData, 'flush_volume', 'flush_volume_design'),
  };

  const summaries = {
    actualSummary: !isEmpty(data) && getStageSummary(startSummary, data),
    designSummary: !isEmpty(stagesData) && getStageSummary(startSummary, stagesData),
    predictionSummary,
  };

  return summaries;
};
