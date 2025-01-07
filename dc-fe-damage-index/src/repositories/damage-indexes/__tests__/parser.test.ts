import { parseDIListFromJSON } from '../parser';
import { mockedDiListJson, mockedDiList } from '../../../mocks/di';

it('should parse list if DIs from json', () => {
  expect(parseDIListFromJSON(mockedDiListJson)).toEqual(mockedDiList);
});
