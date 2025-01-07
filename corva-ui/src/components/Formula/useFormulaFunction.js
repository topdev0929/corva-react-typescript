import { useState, useEffect } from 'react';
import { fromPairs } from 'lodash';
import Formula from 'fparser';

export const useFormulaFunction = (formulaStr, suggestions) => {
  const [formulaFunction, setFormulaFunction] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formulaStr && suggestions && suggestions.length) {
      try {
        const fObj = new Formula(formulaStr);
        const testData = [];
        testData.push(fromPairs(suggestions.map(item => [item, Math.random()])));
        fObj.evaluate(testData);
        setFormulaFunction(fObj);
        setError('');
      } catch (e) {
        setFormulaFunction(null);
        setError(e.message);
      }
    } else {
      setFormulaFunction(null);
      setError('');
    }
  }, [formulaStr, suggestions]);

  return { formulaFunction, error };
};
