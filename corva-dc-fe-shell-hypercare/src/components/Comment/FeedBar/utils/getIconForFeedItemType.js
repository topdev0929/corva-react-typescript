import { get } from 'lodash';

import alertIcon from '../assets/feed-item-type-icons/alert.svg';
import bhaIcon from '../assets/feed-item-type-icons/bha.svg';
import dailyCostIcon from '../assets/feed-item-type-icons/daily-cost.svg';
import documentIcon from '../assets/feed-item-type-icons/document.svg';
import drillerMemoIcon from '../assets/feed-item-type-icons/driller-memo.svg';
import fluidReportIcon from '../assets/feed-item-type-icons/fluid-report.svg';
import operationalNoteIcon from '../assets/feed-item-type-icons/operational-note.svg';
import operationSummaryIcon from '../assets/feed-item-type-icons/operation-summary.svg';
import surveyStationIcon from '../assets/feed-item-type-icons/survey-station.svg';
import annotationMenuIcon from '../assets/annotations-menu.svg';
import lessonsLearnedIcon from '../assets/feed-item-type-icons/lessons-learned.svg';
import nptIcon from '../assets/feed-item-type-icons/npt.svg';

import { FEED_ITEM_TYPES_BY_KEY, FEED_ITEM_TYPES } from '../constants';

export const AVATAR_ICON = 'AVATAR_ICON';

const FEED_TYPES_WITH_AVATAR_ICON = [
  FEED_ITEM_TYPES_BY_KEY.post.type,
  FEED_ITEM_TYPES_BY_KEY.app_annotation.type,
  FEED_ITEM_TYPES.TRACES_MEMO,
];

export function isAvatarIcon(feedItemType) {
  return FEED_TYPES_WITH_AVATAR_ICON.includes(feedItemType);
}

export function getIconForFeedItemType(feedItemType) {
  if (isAvatarIcon(feedItemType)) {
    return AVATAR_ICON;
  } else {
    switch (feedItemType) {
      case get(FEED_ITEM_TYPES_BY_KEY, 'alert.type'): {
        return alertIcon;
      }
      case get(FEED_ITEM_TYPES_BY_KEY, 'operation_summary.type'):
      case get(FEED_ITEM_TYPES_BY_KEY, 'completion_operation_summary.type'): {
        return operationSummaryIcon;
      }
      case get(FEED_ITEM_TYPES_BY_KEY, 'operational_note.type'):
      case get(FEED_ITEM_TYPES_BY_KEY, 'completion_operational_note.type'): {
        return operationalNoteIcon;
      }
      case get(FEED_ITEM_TYPES_BY_KEY, 'bha.type'): {
        return bhaIcon;
      }
      case get(FEED_ITEM_TYPES_BY_KEY, 'daily_cost.type'):
      case get(FEED_ITEM_TYPES_BY_KEY, 'completion_daily_cost.type'): {
        return dailyCostIcon;
      }
      case get(FEED_ITEM_TYPES_BY_KEY, 'document.type'): {
        return documentIcon;
      }
      case get(FEED_ITEM_TYPES_BY_KEY, 'driller_memo.type'): {
        return drillerMemoIcon;
      }
      case get(FEED_ITEM_TYPES_BY_KEY, 'fluid_report.type'): {
        return fluidReportIcon;
      }
      case get(FEED_ITEM_TYPES_BY_KEY, 'survey_station.type'): {
        return surveyStationIcon;
      }
      case get(FEED_ITEM_TYPES_BY_KEY, 'lessons_learned.type'): {
        return lessonsLearnedIcon;
      }
      case get(FEED_ITEM_TYPES_BY_KEY, 'completion_npt_event.type'): {
        return nptIcon;
      }
      // FIXME: Implement when icons will be available
      // get(FEED_ITEM_TYPES_BY_KEY, 'completion_stage.type')
      // get(FEED_ITEM_TYPES_BY_KEY, 'completion_time_log.type')
      default:
        return annotationMenuIcon;
    }
  }
}
