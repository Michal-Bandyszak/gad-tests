import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiLinks } from '@_src/api/utils/api.utils';
import { expect } from '@_src/ui/fixtures/merge.fixture';
import { APIRequestContext, APIResponse } from '@playwright/test';

export async function createCommentWithApi(
  request: APIRequestContext,
  headers: Headers,
  articleId: number,
  commentData?: CommentPayload,
): Promise<APIResponse> {
  const commentDataFinal = commentData || prepareCommentPayload(articleId);
  const responseComment = await request.post(apiLinks.commentsUrl, {
    headers,
    data: commentDataFinal,
  });

  // assert comment
  const commentJson = await responseComment.json();

  const expectedStatusCode = 200;
  await expect(async () => {
    const responseCommentCreated = await request.get(
      `${apiLinks.commentsUrl}/${commentJson.id}`,
    );
    expect(
      responseCommentCreated.status(),
      `Expected status: ${expectedStatusCode} and observed: ${responseCommentCreated.status()}`,
    ).toBe(expectedStatusCode);
  }).toPass({ timeout: 2_000 });
  return commentJson;
}
