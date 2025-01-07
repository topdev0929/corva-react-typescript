import { parseBHAsFromJson } from '../parser';
import { mockedBHAJson, mockedBHAs } from '../../../mocks/bha';

it('should parse BHAs from json', () => {
  expect(parseBHAsFromJson(mockedBHAJson)).toEqual(mockedBHAs);
});
