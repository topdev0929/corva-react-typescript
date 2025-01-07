import {
  CHEMICALS_TYPES,
  CHEMICALS_VOL_TYPES,
  CHEMICALS_MASS_TYPES,
  PROPPANTS_TYPES,
  FLUIDS_TYPES,
} from '~/constants/completion';

export const getElementInfo = ({ designElements, actualElements, rowKey, predictionSummary }) => {
  let elementKeys;
  let unitType;
  switch (rowKey) {
    case 'volumeChemicals':
      elementKeys = CHEMICALS_VOL_TYPES.map(type => type.name);
      unitType = 'volume';
      break;
    case 'massChemicals':
      elementKeys = CHEMICALS_MASS_TYPES.map(type => type.name);
      unitType = 'mass';
      break;
    case 'proppants':
      elementKeys = PROPPANTS_TYPES.map(type => type.name);
      unitType = 'mass';
      break;
    default:
      elementKeys = FLUIDS_TYPES.map(type => type.name);
      unitType = 'oil';
      break;
  }

  return elementKeys.reduce(
    (result, elemKey) => {
      const designVal = designElements[elemKey] && designElements[elemKey].amount;
      const actualVal = actualElements[elemKey] && actualElements[elemKey].amount;
      let predictionVal = 0;
      if (rowKey === 'volumeChemicals' || rowKey === 'massChemicals') {
        const chemicalElement = CHEMICALS_TYPES.find(type => type.name === elemKey) || {};
        predictionVal = predictionSummary[chemicalElement.key];
      }

      if (!designVal && !actualVal && !predictionVal) return result;

      const greater = Math.max(designVal || 0, actualVal || 0);

      return {
        elemMax: Math.max(greater, result.elemMax),
        elemAmount: result.elemAmount.concat({
          key: elemKey,
          design: designVal || 0,
          actual: actualVal || 0,
          predictionVal,
          unitType,
        }),
      };
    },
    {
      elemMax: 0,
      elemAmount: [],
    }
  );
};
