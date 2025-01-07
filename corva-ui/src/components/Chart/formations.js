const xAxis = [
  {
    gridLineColor: '#333333',
    lineColor: '#333333',
    tickWidth: 0,
    gridLineWidth: 1,
    title: {
      style: {
        color: '#9E9E9E',
      },
      text: '',
      enabled: true,
    },
    labels: {
      style: {
        color: '#9E9E9E',
      },
      enabled: true,
    },
    min: 0,
    max: 18112,
    index: 0,
    isX: true,
  },
];

const yAxis = [
  {
    gridLineColor: '#333333',
    lineColor: '#333333',
    labels: {
      style: {
        color: '#9E9E9E',
      },
    },
    title: {
      style: {
        color: '#9E9E9E',
      },
      text: 'Hookload (klbf)',
    },
    startOnTick: false,
    min: 0,
    max: 600.41,
    index: 0,
  },
];

const getAlignStyles = isYAxis =>
  !isYAxis
    ? {
        verticalAlign: 'bottom',
        textAlign: 'left',
        y: -5,
        x: -2,
        rotation: 270,
      }
    : { y: -2 };

export const getFormattedFormations = (formations, isYAxis) => {
  return formations.map(({ text, value }) => {
    return {
      color: 'rgba(255,255,255,0.6)',
      width: 1,
      dashStyle: 'Dash',
      value,
      label: {
        ...getAlignStyles(isYAxis),
        text,
        style: {
          color: '#FFFFFF',
          fontSize: '10px',
          opacity: 0.6,
        },
        useHTML: true,
      },
    };
  });
};

export const updateAxisStyles = ({ chart }) => {
  const { plotLines } = chart.xAxis[0].userOptions;
  const axis = chart.userOptions.chart.inverted ? 'y' : 'x';

  const newPlotLines = [];
  const plotLinesPixels = chart.axes[0].plotLinesAndBands;

  // pick line and use it as main(opacity 1) then find all overlapping lines by using `plotLinesPixels` array then set opacity 0.3 or 0.15 for them
  // consider that lines is sorted by depth
  for (let i = 0; i < plotLines.length; ) {
    const currentLineYPosition = plotLinesPixels[i]?.label?.alignAttr?.[axis];
    const MIN_GAP_BETWEEN_AXES = 12;
    const overlappingLabelsIdx = [];
    let lastOverlapingIndex = i;

    for (let j = i + 1; j < plotLinesPixels.length; j += 1) {
      const nextLineYPosition = plotLinesPixels[j]?.label?.alignAttr?.[axis];
      if (Math.abs(currentLineYPosition - nextLineYPosition) < MIN_GAP_BETWEEN_AXES) {
        overlappingLabelsIdx.push(j);
        lastOverlapingIndex = j;
      } else {
        break;
      }
    }

    if (overlappingLabelsIdx.length) {
      newPlotLines.push(plotLines[i]);
      for (let j = 0; j < overlappingLabelsIdx.length; j += 1) {
        const idx = overlappingLabelsIdx[j];
        if (j === 0) {
          const plotLine = {
            ...plotLines[idx],
            color: 'rgba(255, 255, 255, 0.3)',
            // no influence on a chart, could be used later for defining opacity of icons
            opacity: 0.3,
            label: {
              ...plotLines[idx]?.label,
              style: {
                ...plotLines[idx]?.label?.style,
                opacity: 0.3,
              },
            },
          };
          newPlotLines.push(plotLine);
        }

        if (j >= 1) {
          const plotLine = {
            ...plotLines[idx],
            color: 'rgba(255, 255, 255, 0.15)',
            // no influence on a chart, could be used later for defining opacity of icons
            opacity: 0.15,
            label: {
              ...plotLines[idx]?.label,
              style: {
                ...plotLines[idx]?.label?.style,
                opacity: 0.15,
              },
            },
          };
          newPlotLines.push(plotLine);
        }
      }
      i = lastOverlapingIndex + 1;
    } else {
      newPlotLines.push(plotLines[i]);
      i += 1;
    }
  }

  chart.update({
    xAxis: {
      plotLines: newPlotLines,
    },
  });
};

export const renderFormations = ({ chart, plotLines, axis }) => {
  const isYAxis = axis === 'y';

  chart.update({
    series: {
      data: [null, null],
    },
    chart: {
      inverted: isYAxis,
    },
    xAxis: [
      {
        ...xAxis[0],
        plotLines,
      },
    ],
    yAxis,
  });
  updateAxisStyles({ chart });
};
