import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  ArticlePayload,
  Headers,
  apiLinks,
  getAuthorizationHeader,
  prepareArticlePayload,
} from '@_src/utils/api.utils';
import { APIResponse } from '@playwright/test';

test.describe('crud operations', () => {
  let responseArticle: APIResponse;
  let headers: Headers;
  let articleData: ArticlePayload;

  test.beforeAll('should login', async ({ request }) => {
    headers = await getAuthorizationHeader(request);
  });

  test.beforeEach('create an article', async ({ request }) => {
    articleData = prepareArticlePayload();
    responseArticle = await request.post(apiLinks.articlesUrl, {
      headers,
      data: articleData,
    });
  });

  test('should create an article with logged-in user @GAD-R09-03', async () => {
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

  test('should delete an article with logged-in user GAD-R09-05', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const articleJson = await responseArticle.json();
    const articleId = articleJson.id;

    // Act
    const responseArticleDelete = await request.delete(
      `${apiLinks.articlesUrl}/${articleId}`,
      {
        headers,
      },
    );

    // Assert
    const actualResponseStatus = responseArticleDelete.status();
    expect(
      actualResponseStatus,
      `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);

    // Assert check deleted article
    const responseArticleGet = await request.get(
      `${apiLinks.articlesUrl}/${articleId}`,
    );
    const expectedDeletedArticleStatusCode = 404;
    expect(
      responseArticleGet.status(),
      `expected status code ${expectedDeletedArticleStatusCode}, and received ${responseArticleGet.status()}`,
    ).toBe(expectedDeletedArticleStatusCode);
  });

  test('should not delete an article with non logged-in user GAD-R09-05', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articleJson = await responseArticle.json();
    const articleId = articleJson.id;

    // Act
    const responseArticleDelete = await request.delete(
      `${apiLinks.articlesUrl}/${articleId}`,
    );

    // Assert
    const actualResponseStatus = responseArticleDelete.status();
    expect(
      actualResponseStatus,
      `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);

    // Assert check not deleted article
    const responseArticleGet = await request.get(
      `${apiLinks.articlesUrl}/${articleId}`,
    );
    const expectedNotDeletedArticleStatusCode = 200;
    expect(
      responseArticleGet.status(),
      `expected status code ${expectedNotDeletedArticleStatusCode}, and received ${responseArticleGet.status()}`,
    ).toBe(expectedNotDeletedArticleStatusCode);
  });
});