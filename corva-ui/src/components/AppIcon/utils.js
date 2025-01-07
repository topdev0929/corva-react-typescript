import { SEGMENTS } from '~/constants/segment';

import CompletionAppIcon from './assets/CompletionAppIcon';
import CompletionAppIconBe from './assets/CompletionAppIconBe';
import DrillingAppIcon from './assets/DrillingAppIcon';
import DrillingAppIconBe from './assets/DrillingAppIconBe';
import NoSegmentAppIcon from './assets/NoSegmentAppIcon';
import CompletionAppIconPng from './assets/CompletionAppIcon.png';
import CompletionAppIconBePng from './assets/CompletionAppIconBe.png';
import DrillingAppIconPng from './assets/DrillingAppIcon.png';
import DrillingAppIconBePng from './assets/DrillingAppIconBe.png';
import NoSegmentAppIconPng from './assets/NoSegmentAppIcon.png';

export function getIconComponentBySegment(segment, appDevType = 'ui') {
  if (!segment || !segment.length) return NoSegmentAppIcon;
  const isUiApp = appDevType === 'ui';

  if (segment.includes(SEGMENTS.COMPLETION))
    return isUiApp ? CompletionAppIcon : CompletionAppIconBe;
  if (segment.includes(SEGMENTS.DRILLING)) return isUiApp ? DrillingAppIcon : DrillingAppIconBe;

  return NoSegmentAppIcon;
}

export function getAppIcon(segment, appDevType = 'ui') {
  if (!segment || !segment.length) return NoSegmentAppIconPng;
  const isUiApp = appDevType === 'ui';

  if (segment.includes(SEGMENTS.COMPLETION))
    return isUiApp ? CompletionAppIconPng : CompletionAppIconBePng;
  if (segment.includes(SEGMENTS.DRILLING))
    return isUiApp ? DrillingAppIconPng : DrillingAppIconBePng;

  return NoSegmentAppIconPng;
}
