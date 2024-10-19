import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  getAuthorizationBearer,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.utils';

test.describe('Verify comments CRUD operations @crud @GAD-R09-02', () => {
  let articleId: number;
  let headers;
  test.beforeAll('create an article', async ({ request }) => {
    const articleUrl = '/api/articles';
    const articleData = prepareArticlePayload();

    headers = await getAuthorizationBearer(request);
    // Act
    const responseArticle = await request.post(articleUrl, {
      headers,
      data: articleData,
    });

    const article = await responseArticle.json();
    articleId = article.id;
  });

  test('should not create an comment without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const commentUrl = '/api/comments';
    const commentData = prepareCommentPayload(articleId);

    // Act

    const response = await request.post(commentUrl, {
      data: commentData,
    });

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should  create a comment with a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 201;
    const commentUrl = '/api/comments';
    const commentData = prepareCommentPayload(articleId);

    headers = await getAuthorizationBearer(request);
    const response = await request.post(commentUrl, {
      headers,
      data: commentData,
    });
    const actualResponseStatus = response.status();

    // Assert
    expect(
      actualResponseStatus,
      `expect status code: ${expectedStatusCode}, and received: ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);

    const comment = await response.json();

    expect.soft(comment.body).toEqual(commentData.body);
  });
});
