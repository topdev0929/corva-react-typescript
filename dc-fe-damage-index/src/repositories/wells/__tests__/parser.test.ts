import { parseAssetIdsFormJson, parseWellFromJson } from '../parser';
import { mockedWellsJson, mockedWells } from '../../../mocks/well';

it('should parse asset ids from json', () => {
  expect(parseAssetIdsFormJson({ data: [{ attributes: { asset_id: 1 } }] })).toEqual([1]);
});

it('should parse well from json', () => {
  expect(parseWellFromJson(mockedWellsJson[0])).toEqual(mockedWells[0]);
});
