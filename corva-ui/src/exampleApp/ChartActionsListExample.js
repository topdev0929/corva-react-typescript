import { useState } from 'react';
import Slider from '@material-ui/core/Slider';

import ChartActionsList from '~/components/ChartActionsList';

const RangeApp = () => {
  const [values, setValues] = useState({
    left: 10000,
    right: 15000,
    min: 0,
    max: 20269.7,
  });
  
  const onChange = values => {
    setValues(val => ({ ...val, ...values }));
  };

  const changeRanges = () => {
    setValues({
      left: 5386.8,
      right: 18427,
      min: 0,
      max: 18427,
    });
  };

  return (
    <div style={{ margin: '100px 500px' }}>
      <button onClick={changeRanges}>Reset (change) ranges</button>
      <h1>
        Min: {values.min}. Max: {values.max}
        <br />
        (left) {values.left} - {values.right} (right)
      </h1>
      <Slider 
        min={values.min}
        max={values.max}
        value={[values.left, values.right]}
      />
      <ChartActionsList
        min={values.min}
        max={values.max}
        left={values.left}
        right={values.right}
        onChange={onChange}
      />
    </div>
  );
};

export default RangeApp;
