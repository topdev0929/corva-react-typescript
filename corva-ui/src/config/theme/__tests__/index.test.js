import { darkTheme, lightTheme } from '../index';

describe(`config`, () => {
  describe(`theme`, () => {
    describe(`index`, () => {
      it('lightTheme', () => {
        expect(JSON.parse(JSON.stringify(lightTheme))).toMatchSnapshot();
      });

      it('darkTheme', () => {
        expect(JSON.parse(JSON.stringify(darkTheme))).toMatchSnapshot();
      });
    });
  });
});
