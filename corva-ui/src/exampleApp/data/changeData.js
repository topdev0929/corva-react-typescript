const fs = require('fs');
const fileData = require('./parametersWitsAndDysfanction.json');

const keys = Object.keys(fileData.wits[0].data).filter((key) => key !== 'hole_depth');

const minMax = {};

const getMinMaxes = (arr, key) => {
  let min = Infinity;
  let max = -Infinity;
  arr.forEach(values => {
    const val = values.data[key];
    if (Number.isFinite(val)) {
      if (val > max) {
        max = val;
      }
      if (val < min) {
        min = val;
      }
    }
  });
  return {
    min,
    max,
  };
};

const generateValue = ({ min, max }) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

keys.forEach(key => {
    minMax[key] = getMinMaxes(fileData.wits, key);
});

const newData = {
    wits: fileData.wits.map((item) => {
        const values = keys.reduce((acc, key) => {
            return {
                ...acc,
                [key]: generateValue(minMax[key])
            }
        }, {});
        return {
            ...item,
            data: {
                ...item.data,
                ...values
            }
        }
    })
}

fs.writeFileSync('parametersWitsAndDysfanction2.json', JSON.stringify(newData));
