import { InsightAuthor } from '@/entities/insight/author';

export type InsightComment = {
  id: string;
  text: string;
  timestamp: number;
  author: InsightAuthor;
};
export type CommentPayload = Omit<InsightComment, 'id' | 'timestamp'>;
