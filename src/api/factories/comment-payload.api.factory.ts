import { CommentPayload } from '../models/comment.api.model';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';

export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment();
  const commentData = {
    body: randomCommentData.body,
    date: '2024-10-16T15:00:31Z',
    article_id: articleId,
  };

  return commentData;
}
