import { parseOptimizationParametersFromJSON } from '../parser';
import {
  mockedOPListJson,
  mockedOptimizationParametersList,
} from '../../../mocks/optimization-parameters';

it('should parse optimization parameters from json', () => {
  expect(parseOptimizationParametersFromJSON(mockedOPListJson[0])).toEqual(
    mockedOptimizationParametersList[0]
  );
});
