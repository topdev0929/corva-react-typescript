import { useMemo } from 'react';
import { sortBy, reverse } from 'lodash';
import { string, shape, bool } from 'prop-types';

import { getElementInfo } from './utils';

import ComparisonRow from '../ComparisonRow';

const ElementsComparison = ({ rowKey, summaries, sort, order, showBar, viewMode }) => {
  const { designSummary, actualSummary, predictionSummary } = summaries;

  const designElements = (designSummary && designSummary[rowKey]) || {};
  const actualElements = (actualSummary && actualSummary[rowKey]) || {};

  const { elemMax, elemAmount } = useMemo(
    () =>
      getElementInfo({
        designElements,
        actualElements,
        rowKey,
        predictionSummary,
      }),
    [designElements, actualElements, rowKey, predictionSummary]
  );

  let sortedElem = sort ? sortBy(elemAmount, sort) : elemAmount;
  sortedElem = order && order === 'desc' ? reverse(sortedElem) : sortedElem;

  return sortedElem.map(elem => (
    <ComparisonRow
      key={elem.key}
      rowKey={rowKey}
      label={elem.key}
      elemKey={elem.key}
      elemMax={elemMax}
      summaries={summaries}
      showBar={showBar}
      viewMode={viewMode}
      unitType={elem.unitType}
    />
  ));
};

ElementsComparison.propTypes = {
  rowKey: string,
  sort: string,
  order: string,
  summaries: shape,
  showBar: bool,
  viewMode: string,
};

ElementsComparison.defaultProps = {
  rowKey: '',
  sort: null,
  order: null,
  summaries: {},
  showBar: true,
  viewMode: null,
};

export default ElementsComparison;
