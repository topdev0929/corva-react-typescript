import { Insight, INSIGHT_TYPE, InsightAuthor, InsightComment } from '@/entities/insight';

export const mockedInsightAuthor: InsightAuthor = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  profilePhoto: 'https://picsum.photos/200',
};

export const mockedInsightComment: InsightComment = {
  id: 'id',
  text: 'text',
  timestamp: 1,
  author: mockedInsightAuthor,
};

export const mockedInsightCommentWithAuthor: InsightComment = {
  ...mockedInsightComment,
  author: mockedInsightAuthor,
};

export const mockedInsight: Insight = {
  id: 'id',
  timestamp: 1,
  datetime: '2022-01-01',
  type: INSIGHT_TYPE.OBSERVATION,
  author: mockedInsightAuthor,
  comment: 'comment',
  filesIds: ['fileId'],
  files: [],
  otherComments: [],
};
