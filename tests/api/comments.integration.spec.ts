import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  apiLinks,
  getAuthorizationBearer,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.utils';

test.describe('Verify comments CRUD operations @crud @GAD-R09-02', () => {
  let articleId: number;
  let headers;

  test.beforeAll('create an article', async ({ request }) => {
    const articleData = prepareArticlePayload();

    headers = await getAuthorizationBearer(request);
    // Act
    const responseArticle = await request.post(apiLinks.articleUrl, {
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
    const commentData = prepareCommentPayload(articleId);

    // Act

    const response = await request.post(apiLinks.commentsUrl, {
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

    const commentData = prepareCommentPayload(articleId);

    headers = await getAuthorizationBearer(request);
    const response = await request.post(apiLinks.commentsUrl, {
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
