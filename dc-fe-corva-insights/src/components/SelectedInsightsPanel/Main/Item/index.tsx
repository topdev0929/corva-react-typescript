import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { showErrorNotification, showSuccessNotification } from '@corva/ui/utils';

import { getAllDocuments, getOnlyImages, getVideos } from '@/entities/record';
import {
  getActivityTypeLabel,
  getFieldSampleTypeLabel,
  getInsightTile,
  Insight,
  InsightComment,
  isInsightCanBeCreatedManually,
} from '@/entities/insight';
import { useSelectedInsightsStore } from '@/contexts/selected-insights';
import { useGlobalStore } from '@/contexts/global';
import { getUserShortName } from '@/shared/utils';
import { Feed } from '@/shared/components/Feed';
import { Gallery } from '@/shared/components/Gallery';
import { Linkify } from '@/shared/components/Linkify';

import { AppPreview } from './AppPreview';
import { DocumentsList } from './Documents';
import { SpecificType } from './SpecificType';
import { InsightAvatar } from './InsightAvatar';
import { InsightComments } from './Comments';
import styles from './index.module.css';
import { VideosList } from '@/shared/components/Feed/Videos';

type Props = {
  insight: Insight;
  isFirstOfGroup?: boolean;
  testId?: string;
};

export const InsightItem: FC<Props> = observer(({ insight, testId }) => {
  const globalStore = useGlobalStore();
  const store = useSelectedInsightsStore();

  const handleAddComment = async (text: string) => {
    try {
      await store.addInsightComment(insight, text);
      showSuccessNotification('Comment added');
    } catch {
      showErrorNotification('Failed to add comment');
    }
  };

  const handleUpdateComment = async (comment: InsightComment) => {
    try {
      await store.updateInsightComment(insight, comment);
      showSuccessNotification('Comment updated');
    } catch {
      showErrorNotification('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await store.deleteInsightComment(insight, commentId);
  };

  return (
    <Feed
      testId={testId}
      type="insight"
      title={getUserShortName(insight.author)}
      author={insight.author}
      createdAt={insight.datetime}
      onDelete={() => store.deleteInsight(insight.id)}
      onEdit={
        isInsightCanBeCreatedManually(insight.type)
          ? () => store.requestEditInsight(insight)
          : undefined
      }
      avatar={
        <InsightAvatar author={insight.author} tile={getInsightTile(insight)} testId={testId} />
      }
    >
      {insight.activityType && (
        <SpecificType label="Activity" value={getActivityTypeLabel(insight.activityType)} />
      )}
      {insight.fieldSampleType && (
        <SpecificType
          label="Field Sample"
          value={getFieldSampleTypeLabel(insight.fieldSampleType)}
        />
      )}
      <span className={styles.text}>
        <Linkify>{insight.comment}</Linkify>
      </span>
      <AppPreview
        insight={insight}
        currentUser={globalStore.currentUser}
        appId={globalStore.appId}
      />
      <Gallery
        images={getOnlyImages(insight.files)}
        onLoadUrl={ref => store.getFileLink(ref)}
        testId={`${testId}_gallery`}
      />
      <VideosList
        videos={getVideos(insight.files)}
        onLoadUrl={ref => store.getFileLink(ref)}
        testId={`${testId}_videos`}
      />
      <DocumentsList
        documents={getAllDocuments(insight.files)}
        onGetFileLink={ref => store.getFileLink(ref)}
        testId={testId}
      />
      <InsightComments
        comments={insight.otherComments}
        user={globalStore.user}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        testId={`${testId}_comments`}
      />
    </Feed>
  );
});

InsightItem.displayName = 'InsightItem';
