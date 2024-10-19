import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  getAuthorizationBearer,
  prepareArticlePayload,
} from '@_src/utils/api.utils';

test.describe('Verify articles CRUD operations @crud @GAD-R09-01', () => {
  test('should not create an article without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articleUrl = '/api/articles';
    const articleData = prepareArticlePayload();

    // Act

    const response = await request.post(articleUrl, {
      data: articleData,
    });

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
  test('should  create an article with a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 201;

    const articleUrl = '/api/articles';
    const articleData = prepareArticlePayload();

    // Act
    const headers = await getAuthorizationBearer(request);

    const responseArticle = await request.post(articleUrl, {
      headers,
      data: articleData,
    });
    const actualResponseStatus = responseArticle.status();

    // Assert
    expect(
      actualResponseStatus,
      `Status code expected: ${expectedStatusCode}, but received: ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);

    const article = await responseArticle.json();
    expect.soft(article.title).toEqual(articleData.title);
    expect.soft(article.body).toEqual(articleData.body);
  });
});
