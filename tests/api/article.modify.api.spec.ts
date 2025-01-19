import { expectGetResponseStatus } from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiLinks } from '@_src/api/utils/api.utils';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify articles PUT operations',
  { tag: ['@crud', '@article', '@api', '@put'] },
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
      'should modify an article with logged-in user ',
      { tag: '@GAD-R010-01' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;
        const modifiedArticleData = prepareArticlePayload();

        // Act
        const responseArticleModify = await request.put(
          `${apiLinks.articlesUrl}/${articleId}`,
          {
            headers,
            data: modifiedArticleData,
          },
        );

        // Assert
        const actualResponseStatus = responseArticleModify.status();

        expect(
          actualResponseStatus,
          `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert check modified article
        const modifiedArticleGet = await request.get(`${apiLinks.articlesUrl}/${articleId}`);
        const modifiedArticleJson = await modifiedArticleGet.json();
      
        expect.soft(modifiedArticleJson.title).toEqual(modifiedArticleData.title)
        expect.soft(modifiedArticleJson.body).toEqual(modifiedArticleData.body)
        expect.soft(articleJson.title).not.toEqual(modifiedArticleData.title)
        expect.soft(articleJson.body).not.toEqual(modifiedArticleData.body)
        
      },
    );

    test(
      'should not modify an article with non logged-in user',
      { tag: '@GAD-R010-01' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;
        const modifiedArticleData = prepareArticlePayload();

        // Act
        const responseArticleModify = await request.put(
          `${apiLinks.articlesUrl}/${articleId}`,
          {
            data: modifiedArticleData,
          }

        );

        // Assert
        const actualResponseStatus = responseArticleModify.status();
        expect(
          actualResponseStatus,
          `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);
     
        // Assert check modified article
        const unModifiedArticleGet = await request.get(`${apiLinks.articlesUrl}/${articleId}`);
        const unModifiedArticleJson = await unModifiedArticleGet.json();
        
        expect.soft(unModifiedArticleJson.title).not.toEqual(modifiedArticleData.title)
        expect.soft(unModifiedArticleJson.body).not.toEqual(modifiedArticleData.body)
        expect.soft(unModifiedArticleJson.title).toEqual(articleJson.title)
        expect.soft(unModifiedArticleJson.body).toEqual(articleJson.body)
       
      },
    );
  },
);
test.describe(
  'Verify articles PATCH operations',
  { tag: ['@crud', '@article', '@api', '@patch'] },
  () => {
    let responseArticle: APIResponse;
    let headers: Headers;
    let articleId: number;

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
      'should partially modify an article with logged-in user',
      { tag: '@GAD-R010-03' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const articleJson = await responseArticle.json();
        const modifiedArticleData = prepareArticlePayload();

        // Act
        const responseArticleModify = await request.patch(
          `${apiLinks.articlesUrl}/${articleId}`,
          {
            headers,
            data: { title: modifiedArticleData.title }, // Corrected here
          },
        );

        // Assert
        const actualResponseStatus = responseArticleModify.status();
        expect(
          actualResponseStatus,
          `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert check modified article
        const modifiedArticleGet = await request.get(`${apiLinks.articlesUrl}/${articleId}`);
        const modifiedArticleJson = await modifiedArticleGet.json();
      
        expect.soft(modifiedArticleJson.title).toEqual(modifiedArticleData.title);
        expect.soft(articleJson.title).not.toEqual(modifiedArticleData.title);
      },
    );

    test(
      'should not partially modify an article with non logged-in user',
      { tag: '@GAD-R010-03' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const articleJson = await responseArticle.json();
        
        // Act
        const responseArticleModify = await request.patch(
          `${apiLinks.articlesUrl}/${articleId}`,
          {
            data: { title: 'New Title' }, // Sending a valid title update without headers
          }
        );

        // Assert
        const actualResponseStatus = responseArticleModify.status();
        expect(
          actualResponseStatus,
          `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);
     
        // Assert check modified article
        const unModifiedArticleGet = await request.get(`${apiLinks.articlesUrl}/${articleId}`);
        const unModifiedArticleJson = await unModifiedArticleGet.json();
        
        expect.soft(unModifiedArticleJson.title).toEqual(articleJson.title);
      },
    );

    test(
      'should not partially modify an article with improper field',
      { tag: '@GAD-R010-03' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 422;
        const nonExistingField = 'nonExistingField';
        const expectedErrorMessage = `One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "${nonExistingField}" not in [id,user_id,title,body,date,image]`;

        const articleJson = await responseArticle.json();
        
        const modifiedArticleData: { [key: string]: string } = {};
        modifiedArticleData[nonExistingField] = 'Hello';

        // Act
        const responseArticleModify = await request.patch(
          `${apiLinks.articlesUrl}/${articleId}`,
          {
            headers,
            data: modifiedArticleData,
          }
        );

        // Assert
        const actualResponseStatus = responseArticleModify.status();
        
        expect(
          actualResponseStatus,
          `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);
     
        // Assert check modified article remains unchanged
        const unModifiedArticleGet = await request.get(`${apiLinks.articlesUrl}/${articleId}`);
        const unModifiedArticleGetJson = await responseArticleModify.json()
        expect.soft(unModifiedArticleGetJson.error.message).toEqual(expectedErrorMessage);
      },
    );
  },
);

