import { useState } from 'react';

import RangeSlider from '~/components/RangeSlider';

const RangeApp = () => {
  const [values, setValues] = useState({
    left: 5386.8,
    right: 20269.7,
    min: 0,
    max: 20269.7,
  });
  
  const [resetInt, setResetInt] = useState(0);

  const onChangeEnd = values => {
    setValues(val => ({ ...val, ...values }));
  };

  const changeRanges = () => {
    setValues({
      left: 5386.8,
      right: 18427,
      min: 0,
      max: 18427,
    });
    setResetInt(1);
  };

  return (
    <div style={{ margin: '100px 500px' }}>
      <button onClick={changeRanges}>Reset (change) ranges</button>
      <h1>
        Min: {values.min}. Max: {values.max}
        <br />
        (left) {values.left} - {values.right} (right)
      </h1>
      <RangeSlider
        leftRange={values.left}
        rightRange={values.right}
        minRange={values.min}
        maxRange={values.max}
        onChange={onChangeEnd}
        hideDecimals
        resetInt={resetInt}
        onChangeFinish={onChangeEnd}
      />
    </div>
  );
};

export default RangeApp;
