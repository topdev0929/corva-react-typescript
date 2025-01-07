import {
  getFitInPercent,
  getLastOptimizationParameters,
  getFitInStatus,
  generateFitInParameters,
  sortParametersByTime,
} from '../helpers';
import {
  mockedFitInParameters,
  mockedOptimizationParametersList,
  mockedSortedOptimizationParametersList,
} from '../../../mocks/optimization-parameters';
import { FIT_IN_STATUS } from '../../../entities/optimization-parameter';
import { mockedDiList } from '../../../mocks/di';

describe('getLastOptimizationParameters function', () => {
  it('should return first item from list', () => {
    expect(getLastOptimizationParameters(mockedOptimizationParametersList)).toEqual(
      mockedOptimizationParametersList[0]
    );
  });
});

describe('getFitInPercent function', () => {
  it('should return fit in percent', () => {
    expect(getFitInPercent(mockedFitInParameters)).toEqual(50);
  });
});

describe('getFitInStatus function', () => {
  it('should return safe status', () => {
    expect(getFitInStatus(mockedFitInParameters)).toEqual(FIT_IN_STATUS.SAFE);
  });

  it('should return warn status', () => {
    expect(getFitInStatus({ ...mockedFitInParameters, real: 185 })).toEqual(FIT_IN_STATUS.WARN);
  });

  it('should return danger status', () => {
    expect(getFitInStatus({ ...mockedFitInParameters, real: 90 })).toEqual(FIT_IN_STATUS.DANGER);
  });
});

describe('generateFitInParameters function', () => {
  let parameters;
  let di;
  let type;

  beforeEach(() => {
    [parameters] = mockedOptimizationParametersList;
    [di] = mockedDiList;
    type = 'ROP';
  });

  it('should return empty list if there is no di', () => {
    expect(generateFitInParameters(parameters, null, type)).toEqual([]);
  });

  it('should return empty list if there are no parameters', () => {
    expect(generateFitInParameters(null, di, type)).toEqual([]);
  });

  it('should return fit in parameters', () => {
    expect(generateFitInParameters(parameters, di, type)).toEqual([
      {
        min: parameters.lowROPWeightOnBit,
        max: parameters.highROPWeightOnBit,
        real: di.weightOnBit,
        id: `ROP_weightOnBit`,
        type,
      },
      {
        min: parameters.lowROPRotaryRPM,
        max: parameters.highROPRotaryRPM,
        real: di.rotaryRPM,
        id: `ROP_rotaryRPM`,
        type,
      },
      {
        min: parameters.lowROPMudFlowIn,
        max: parameters.highROPMudFlowIn,
        real: di.mudFlowIn,
        id: `ROP_mudFlowIn`,
        type,
      },
    ]);
  });
});

describe('sortParametersByTime function', () => {
  it('should sort list of parameters', () => {
    expect(sortParametersByTime(mockedOptimizationParametersList)).toEqual(
      mockedSortedOptimizationParametersList
    );
  });
});
