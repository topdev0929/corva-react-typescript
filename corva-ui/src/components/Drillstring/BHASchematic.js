import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const COLORS = {
  pdcBit: '#239FE6',
  triconeBit: '#085EDF',
  pdm: '#C208DF',
  stabilizer: 'yellow',
  other: '#8398A5',
  rss: '#dd375e',
  ur: '#44ff44',
};

const BIT_WIDTH = 6;
const PDM_HEIGHT = 4;
const HORIZONTAL_MARGIN = 8;

function BHASchematic({ schematic, containerWidth, containerHeight }) {
  const canvasRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const { clientWidth: width, clientHeight: height } = containerRef.current;

    canvas.width = width - HORIZONTAL_MARGIN;
    canvas.height = height;
    canvas.style.width = `${width - HORIZONTAL_MARGIN}px`;
    canvas.style.height = `${height}px`;

    // NOTE: Count each comonents by family
    const bitStabCount = schematic.filter(item => ['bit', 'stabilizer', 'ur'].includes(item.family))
      .length;
    const pdmRssCount = schematic.filter(item => ['pdm', 'rss'].includes(item.family)).length;
    const nonMagCount = schematic.filter(item => item.family === 'other').length;

    // NOTE: Bit, Stabilizer --> width: 12px
    // Pdm, rss length ---> Non mag length * 2
    const nonMagLength = (width - BIT_WIDTH * bitStabCount) / (nonMagCount + pdmRssCount * 2);

    const dataToDraw = [];
    let x = 0;
    [...schematic].reverse().forEach(item => {
      let barWidth = 0;
      if (['bit', 'stabilizer', 'ur'].includes(item.family)) {
        barWidth = BIT_WIDTH;
      } else if (['pdm', 'rss'].includes(item.family)) {
        barWidth = nonMagLength * 2;
      } else {
        barWidth = nonMagLength;
      }

      switch (item.family) {
        case 'bit':
          dataToDraw.push({
            type: 'rect',
            x,
            y: height / 2 - BIT_WIDTH,
            width: barWidth,
            height: BIT_WIDTH * 2,
            fillColor: item.bitType === 'pdc' ? COLORS.pdcBit : COLORS.triconeBit,
          });
          break;
        case 'ur':
          dataToDraw.push({
            type: 'rect',
            x,
            y: height / 2 - BIT_WIDTH,
            width: barWidth,
            height: BIT_WIDTH * 2,
            fillColor: COLORS.ur,
          });
          break;
        case 'pdm':
          if (item.hasStabilizer) {
            dataToDraw.push(
              {
                type: 'rect',
                x: x + (barWidth / 2 - BIT_WIDTH / 2),
                y: height / 2 - BIT_WIDTH,
                width: BIT_WIDTH,
                height: BIT_WIDTH * 2,
                fillColor: COLORS.stabilizer,
              },
              {
                type: 'rect',
                x,
                y: height / 2 - PDM_HEIGHT / 2,
                width: barWidth,
                height: PDM_HEIGHT,
                fillColor: COLORS.pdm,
              }
            );
          } else {
            dataToDraw.push({
              type: 'rect',
              x,
              y: height / 2 - PDM_HEIGHT / 2,
              width: barWidth,
              height: PDM_HEIGHT,
              fillColor: COLORS.pdm,
            });
          }
          break;
        case 'rss':
          dataToDraw.push({
            type: 'rect',
            x,
            y: height / 2 - PDM_HEIGHT / 2,
            width: barWidth,
            height: PDM_HEIGHT,
            fillColor: COLORS.rss,
          });
          break;
        case 'stabilizer':
          dataToDraw.push({
            type: 'rect',
            x,
            y: height / 2 - BIT_WIDTH,
            width: barWidth,
            height: BIT_WIDTH * 2,
            fillColor: COLORS.stabilizer,
          });
          break;
        case 'other':
          dataToDraw.push({
            type: 'rect',
            x,
            y: height / 2 - PDM_HEIGHT / 2,
            width: barWidth,
            height: PDM_HEIGHT,
            fillColor: COLORS.other,
          });
          break;
        default:
          break;
      }

      x += barWidth;
    });

    dataToDraw.forEach(item => {
      context.fillStyle = item.fillColor;
      context.fillRect(item.x, item.y, item.width, item.height);
    });
  });

  const containerStyle = {
    width: containerWidth ? `${containerWidth}px` : '100%',
    height: containerHeight ? `${containerHeight}px` : '100%',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <canvas ref={canvasRef} />
    </div>
  );
}

BHASchematic.propTypes = {
  containerWidth: PropTypes.number,
  containerHeight: PropTypes.number,
  schematic: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

BHASchematic.defaultProps = {
  containerWidth: null,
  containerHeight: null,
};

export default BHASchematic;
