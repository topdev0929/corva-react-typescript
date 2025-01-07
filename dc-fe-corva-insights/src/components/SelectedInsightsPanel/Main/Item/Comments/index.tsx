import { InsightComment } from '@/entities/insight';
import { InsightAuthor } from '@/entities/insight/author';
import { CommentInput } from '@/shared/components/CommentInput';
import { Comment } from '@/shared/components/Comment';

import styles from './index.module.css';

type Props = {
  comments: InsightComment[];
  user: InsightAuthor;
  onAddComment: (text: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onUpdateComment: (comment: InsightComment) => Promise<void>;
  testId?: string;
};

export const InsightComments = ({
  comments,
  user,
  onDeleteComment,
  onUpdateComment,
  onAddComment,
  testId,
}: Props) => {
  return (
    <div className={styles.container}>
      <CommentInput onSend={onAddComment} user={user} testId={`${testId}_add`} />
      {!!comments.length && (
        <div className={styles.list}>
          {comments.map((comment, index) => (
            <Comment
              key={comment.id}
              text={comment.text}
              timestamp={comment.timestamp}
              author={comment.author}
              user={user}
              onDelete={() => onDeleteComment(comment.id)}
              onEdit={text => onUpdateComment({ ...comment, text })}
              testId={`${testId}_item_${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
