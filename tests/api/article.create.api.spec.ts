import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiLinks } from '@_src/api/utils/api.utils';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Verify article CREATE operations @crud @article @api', () => {
  test('should not create an article without a logged-in user  @GAD-R09-03', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articleData = prepareArticlePayload();

    // Arrange
    const response = await request.post(apiLinks.articlesUrl, {
      data: articleData,
    });

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});

test.describe('create operations', () => {
  let headers: Headers;

  test.beforeAll('should login', async ({ request }) => {
    headers = await getAuthorizationHeader(request);
  });

  test('should create an article with logged-in user @GAD-R09-03', async ({
    request,
  }) => {
    const data = await createArticleWithApi(request, headers);
    const articleData = data.articleData;
    const responseArticle = data.responseArticle;
    // Arrange
    const expectedStatusCode = 201;

    // Assert
    const actualResponseStatus = responseArticle.status();
    expect(
      actualResponseStatus,
      `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);

    const articleJson = await responseArticle.json();
    expect.soft(articleJson.title).toEqual(articleData.title);
    expect.soft(articleJson.body).toEqual(articleData.body);
  });
});
