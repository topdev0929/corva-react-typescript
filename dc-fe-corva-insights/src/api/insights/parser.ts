import { Insight, InsightAuthor, InsightPayload } from '@/entities/insight';

const parseAuthorFromJson = (id: number, author?: any): InsightAuthor => {
  return author
    ? { ...author, id: author.id || id }
    : {
        id,
        profilePhoto: '',
        firstName: '',
        lastName: '',
      };
};

export const parseInsightFromJson = (obj: any): Insight => {
  return {
    id: obj._id,
    timestamp: obj.timestamp,
    app: obj.data.app,
    settings: obj.data.settings,
    datetime: obj.data.datetime,
    type: obj.data.event_type,
    author: parseAuthorFromJson(obj.data.user_id, obj.data.author),
    comment: obj.data.comment,
    activityType: obj.data.activity_type,
    fieldSampleType: obj.data.field_sample_type,
    filesIds: obj.data.files || [],
    otherComments: obj.data.other_comments
      ? obj.data.other_comments.map(comment => ({
          ...comment,
          author: parseAuthorFromJson(comment.userId, comment.author),
        }))
      : [],
    files: [],
  };
};

export function convertInsightToJSON(payload: InsightPayload): any {
  return {
    app: payload.app,
    settings: payload.settings,
    datetime: payload.datetime,
    event_type: payload.type,
    author: payload.author,
    comment: payload.comment,
    activity_type: payload.activityType,
    field_sample_type: payload.fieldSampleType,
    files: payload.filesIds,
    other_comments: payload.otherComments,
  };
}

export const parseInsightsFromJson = (list: any[]): Insight[] => {
  return list.map(item => parseInsightFromJson(item));
};
