import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiLinks } from '@_src/api/utils/api.utils';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe('Verify comments create operations @crud @api @comments', () => {
  let articleId: number;
  let headers: Headers;

  test.beforeAll('create an article', async ({ request }) => {
    headers = await getAuthorizationHeader(request);
    const result = await createArticleWithApi(request, headers);

    if ('responseArticle' in result) {
      const article = await result.responseArticle.json();
      articleId = article.id;
    } else {
      throw new Error(
        'Unexpected response structure from createArticleWithApi',
      );
    }
  });

  test('should not create an comment without a logged-in user @GAD-R08-04', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const commentData = prepareCommentPayload(articleId);

    // Arrange
    const response = await request.post(apiLinks.commentsUrl, {
      data: commentData,
    });

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test.describe('create operations', () => {
    let responseComment: APIResponse;
    let commentData: CommentPayload;

    test.beforeEach('create a comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId);
      responseComment = await createCommentWithApi(request, headers, {
        commentData,
      });
    });
    test('should create a comment with logged-in user @GAD-R08-04', async () => {
      // Arrange
      const expectedStatusCode = 201;

      // Assert
      const actualResponseStatus = responseComment.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await responseComment.json();
      expect.soft(comment.body).toEqual(commentData.body);
    });
  });
});
