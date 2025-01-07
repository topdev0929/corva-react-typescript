import { DamageIndex, WellDILists, isCurrentDIFromList } from '../index';
import { getWellColor, Well } from '../../well';
import { BHA, convertBHAListToMap } from '../../bha';

import { DIListChartPoint, DIListLine, LINE_NAME_SEPARATOR, PointGeneratorConfig } from './index';

type BHAPointsMap = Map<DamageIndex['bha'], DIListChartPoint[]>;

export const MARKER_URL =
  'url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjIwIiB3aWR0aD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxMCIgZmlsbD0iIzAzQkNENCIgb3BhY2l0eT0iMC4yNCIgLz4KICAgIDxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSIjMDNCQ0Q0IiAvPgo8L3N2Zz4=)';

export const getWellNameFromLine = (name: string): string => {
  return name.split(LINE_NAME_SEPARATOR)[0];
};

/*
 * The logic to convert DI data to chart data.
 * */
const diToChartPoint = (
  di: DamageIndex,
  isAddMarker: boolean,
  xPath: keyof DamageIndex,
  yPath: keyof DamageIndex
): DIListChartPoint => {
  return {
    x: di[xPath] as number,
    y: di[yPath] as number,
    marker: {
      enabled: isAddMarker,
      symbol: isAddMarker ? MARKER_URL : undefined,
    },
    custom: {
      index: di.value,
      time: di.time,
      depth: di.depth,
      rop: di.rop,
    },
  };
};

const sortPoints = (points: DIListChartPoint[]): DIListChartPoint[] => {
  return points.sort((aPoint, bPoint) => aPoint.x - bPoint.x);
};

const createLineName = (well: Well, bha: string) => {
  return `${well.name}${LINE_NAME_SEPARATOR}${bha}`;
};

const generatePointsForBHAs = (
  diList: DamageIndex[],
  pointGeneratorConfig: PointGeneratorConfig
): BHAPointsMap => {
  const { bhasToRemove, isActiveWell, xPath, yPath } = pointGeneratorConfig;
  const bhasPointsMap: BHAPointsMap = new Map();
  const bhasToRemoveMap = convertBHAListToMap(bhasToRemove);
  for (let index = 0; index < diList.length; index += 1) {
    const di = diList[index];
    if (bhasToRemoveMap.has(di.bha)) continue;
    const point = diToChartPoint(di, isActiveWell && isCurrentDIFromList(index), xPath, yPath);
    const pointsForBHA = bhasPointsMap.get(di.bha);
    if (pointsForBHA) {
      bhasPointsMap.set(di.bha, pointsForBHA.concat([point]));
    } else {
      bhasPointsMap.set(di.bha, [point]);
    }
  }
  return bhasPointsMap;
};

const generateLinesForBHAs = (
  diList: DamageIndex[],
  well: Well,
  pointGeneratorConfig: PointGeneratorConfig,
  wellIndex?: number
): DIListLine[] => {
  const bhasPointsMap = generatePointsForBHAs(diList, pointGeneratorConfig);
  return [...bhasPointsMap.entries()].map(([key, points], index) => {
    return {
      points: sortPoints(points),
      name: createLineName(well, key),
      isActive: pointGeneratorConfig.isActiveWell,
      color: getWellColor(pointGeneratorConfig.isActiveWell, wellIndex),
      showInLegend: index === 0,
    };
  });
};

export const generateLinesForActiveWell = (
  diList: DamageIndex[],
  well: Well,
  bhasToRemove: BHA[],
  xPath: keyof DamageIndex,
  yPath: keyof DamageIndex
): DIListLine[] => {
  return generateLinesForBHAs(diList, well, {
    isActiveWell: true,
    bhasToRemove,
    xPath,
    yPath,
  });
};

export const generateLinesForOffsetWells = (
  wellDILists: WellDILists,
  xPath: keyof DamageIndex,
  yPath: keyof DamageIndex
): DIListLine[] => {
  return wellDILists
    .map(([well, diList], index) => {
      return generateLinesForBHAs(
        diList,
        well,
        { isActiveWell: false, bhasToRemove: [], xPath, yPath },
        index
      );
    })
    .flat()
    .filter(line => line.points.length);
};
