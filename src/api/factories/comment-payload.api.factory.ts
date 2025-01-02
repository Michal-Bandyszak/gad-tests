import { CommentPayload } from '../models/comment.api.model';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';

export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment();
  const commentData = {
    body: randomCommentData.body,
    date: new Date().toISOString(),
    article_id: articleId,
  };

  return commentData;
}
