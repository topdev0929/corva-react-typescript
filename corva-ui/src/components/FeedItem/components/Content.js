/* eslint-disable react/prop-types */
import { get } from 'lodash';
import { fromJS } from 'immutable';
import { FEED_ITEM_TYPES_BY_KEY, FEED_ITEM_TYPES } from '~/constants/feed';
import { THEMES } from '~/constants/theme';

import AlertFeedItem from '../feedItemTypes/AlertFeedItem';
import PostFeedItem from '../feedItemTypes/PostFeedItem';
import GeosteeringFeedItem from '../feedItemTypes/GeosteeringFeedItem';
import DrillingOperationalNoteFeedItem from '../feedItemTypes/DrillingOperationalNoteFeedItem';
import DrillingOperationSummaryFeedItem from '../feedItemTypes/DrillingOperationSummaryFeedItem';
import DrillingDailyCostFeedItem from '../feedItemTypes/DrillingDailyCostFeedItem';
import DrillingDocumentFeedItem from '../feedItemTypes/DocumentFeedItem';
import DrillingDrillerMemoFeedItem from '../feedItemTypes/DrillerMemoFeedItem';
import DrillingNptFeedItem from '../feedItemTypes/NptFeedItem';
import DrillingSurveyStationFeedItem from '../feedItemTypes/SurveyStationFeedItem';
import DrillingLessonsLearnedFeedItem from '../feedItemTypes/LessonsLearnedFeedItem';
import TracesMemoFeedItem from '../feedItemTypes/TracesMemoFeedItem';
import DepthCommentFeedItem from '../feedItemTypes/DepthCommentFeedItem';
import CompletionOperationalNoteFeedItem from '../feedItemTypes/CompletionOperationalNoteFeedItem';
import CompletionOperationSummaryFeedItem from '../feedItemTypes/CompletionOperationSummaryFeedItem';
import CompletionDailyCostFeedItem from '../feedItemTypes/CompletionDailyCostFeedItem';
import CompletionDocumentFeedItem from '../feedItemTypes/CompletionDocumentFeedItem';
import CompletionNptFeedItem from '../feedItemTypes/CompletionNptFeedItem';
import CompletionStageOverviewFeedItem from '../feedItemTypes/StageOverviewFeedItem';
import AppAnnotationFeedItem from '../feedItemTypes/AppAnnotationFeedItem';
import WellPlanFeedItem from '../feedItemTypes/WellPlanFeedItem';
import FluidReportFeedItem from '../feedItemTypes/FluidReportFeedItem';
import BhaFeedItem from '../feedItemTypes/BhaFeedItem';
import DvDCommentFeedItem from '../feedItemTypes/DvDCommentFeedItem';
import PCCommentFeedItem from '../feedItemTypes/PCCommentFeedItem';
import HookloadCommentFeedItem from '../feedItemTypes/HookloadCommentFeedItem';
import NptLessonsCommentFeedItem from '../feedItemTypes/NptLessonsCommentFeedItem';

const PAGE_NAME = 'Feed_Content';

// NOTE: Some feed items uses embedded apps inside
const APP_CONTEXT = {
  view: 'feedItem',
  theme: THEMES.DARK,
};

const Content = ({ feedItem, appData, customFeedItemTypeTemplates, currentUser, ...props }) => {
  // Temporary solution for the feed items
  // whose implementation is in progress
  if (feedItem.type in customFeedItemTypeTemplates) {
    const Template = customFeedItemTypeTemplates[feedItem.type];
    return (
      <Template
        data-testid={`${PAGE_NAME}_template`}
        feedItem={fromJS(feedItem)}
        appData={fromJS(appData)}
        appContext={fromJS(APP_CONTEXT)}
      />
    );
  }

  switch (feedItem.type) {
    case get(FEED_ITEM_TYPES_BY_KEY, 'alert.type'):
      return <AlertFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'post.type'):
      return <PostFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'geosteering_comments.type'):
      return <GeosteeringFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'dvd_comment.type'):
      return <DvDCommentFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'pc_comment.type'):
    case get(FEED_ITEM_TYPES_BY_KEY, 'drilling_dysfunction_event.type'):
      return <PCCommentFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'hookload_broomstick_comment.type'):
      return <HookloadCommentFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'operational_note.type'):
      return <DrillingOperationalNoteFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'operation_summary.type'):
      return <DrillingOperationSummaryFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'daily_cost.type'):
      return <DrillingDailyCostFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'document.type'):
      return <DrillingDocumentFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'driller_memo.type'):
      return <DrillingDrillerMemoFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'npt_event.type'):
      return <DrillingNptFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'survey_station.type'):
      return <DrillingSurveyStationFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'completion_operational_note.type'):
      return <CompletionOperationalNoteFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'completion_operation_summary.type'):
      return <CompletionOperationSummaryFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'completion_daily_cost.type'):
      return <CompletionDailyCostFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'completion_document.type'):
      return <CompletionDocumentFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'completion_npt_event.type'):
      return <CompletionNptFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'completion_actual_stage.type'):
      return <CompletionStageOverviewFeedItem feedItem={feedItem} />;
    case FEED_ITEM_TYPES.TRACES_MEMO:
      return <TracesMemoFeedItem feedItem={feedItem} />;
    case FEED_ITEM_TYPES.DEPTH_COMMENTS:
      return <DepthCommentFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'lessons_learned.type'):
      return <DrillingLessonsLearnedFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'bha.type'):
      return <BhaFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'fluid_report.type'):
      return <FluidReportFeedItem feedItem={feedItem} />;
    case get(FEED_ITEM_TYPES_BY_KEY, 'app_annotation.type'):
      return (
        <AppAnnotationFeedItem
          feedItem={feedItem}
          appData={appData}
          appContext={APP_CONTEXT}
          currentUser={currentUser}
          {...props}
        />
      );
    case get(FEED_ITEM_TYPES_BY_KEY, 'well_plan.type'):
      return (
        <WellPlanFeedItem
          feedItem={feedItem}
          appData={appData}
          appContext={APP_CONTEXT}
          {...props}
        />
      );
    case get(FEED_ITEM_TYPES_BY_KEY, 'npt_lessons_comment.type'):
      return <NptLessonsCommentFeedItem feedItem={feedItem} />;
    default:
      return null;
  }
};

export default Content;
