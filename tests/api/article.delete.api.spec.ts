import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiLinks } from '@_src/api/utils/api.utils';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify articles DELETE operations',
  { tag: ['@crud', '@article', '@api'] },
  () => {
    let responseArticle: APIResponse;
    let headers: Headers;
    let articleId: number

    test.beforeAll('should login', async ({ request }) => {
      headers = await getAuthorizationHeader(request);
    });

    test.beforeEach('should create article', async ({ request }) => {
      const result = await createArticleWithApi(request, headers);
      responseArticle = result.responseArticle;
      const article = await responseArticle.json();
      articleId = article.id;
    });
    

    test(
      'should delete an article with logged-in user',
      { tag: '@GAD-R09-05' },
      async ({ request }) => {
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
        const responseArticleGet = await request.get(`${apiLinks.articlesUrl}/${articleId}`);
        const expectedDeletedArticleStatusCode = 404;
        expect(responseArticleGet.status(), `expect status code ${expectedDeletedArticleStatusCode}, and received ${responseArticleGet.status()} `).toBe(expectedDeletedArticleStatusCode)
        
      },
    );

    test(
      'should not delete an article with non logged-in user',
      { tag: '@GAD-R09-05' },
      async ({ request }) => {
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
      },
    );
  },
);
