import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiLinks } from '@_src/api/utils/api.utils';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comments modify operations',
  { tag: ['@crud', '@api', '@comment', '@put'] },
  () => {
    let articleId: number;
    let headers: Headers;
    let responseComment: APIResponse;

    test.beforeAll(async ({ request }) => {
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

    test.beforeEach(async ({ request }) => {
      responseComment = await createCommentWithApi(request, headers, {
        articleId: articleId,
      });
    });

    test(
      'should modify a comment with logged-in user ',
      { tag: '@GAD-R10-02' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const commentJson = await responseComment.json();
        const modifiedCommentData = await prepareCommentPayload(articleId);

        // Act
        const responseCommentModified = await request.put(
          `${apiLinks.commentsUrl}/${commentJson.id}`,
          {
            headers,
            data: modifiedCommentData
          },
        );

        // Assert
        const actualResponseStatus = responseCommentModified.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert check modified comment
        const modifiedCommentGet = await request.get(`${apiLinks.commentsUrl}/${commentJson.id}`);
        const modifiedCommentJson = await modifiedCommentGet.json();
      
       
        expect.soft(modifiedCommentJson.body).toEqual(modifiedCommentData.body)
        expect.soft(commentJson.body).not.toEqual(modifiedCommentData.body)
      },
    );

    test(
      'should not modify a comment with a non logged-in user',
      { tag: '@GAD-R10-02' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const commentJson = await responseComment.json();
        const modifiedCommentData = await prepareCommentPayload(articleId)

        // Act
        const responseCommentNotModified = await request.put(
          `${apiLinks.commentsUrl}/${commentJson.id}`, {
            data: modifiedCommentData
          }
        );

        // Assert
        const actualResponseStatus = responseCommentNotModified.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert non modified comment
        const modifiedCommentGet = await request.get(
          `${apiLinks.commentsUrl}/${commentJson.id}`,
        );

        const modifiedCommentGetJson = await modifiedCommentGet.json();

        expect.soft(modifiedCommentGetJson.body).not.toEqual(modifiedCommentData.body);
        expect.soft(modifiedCommentGetJson.body).toEqual(commentJson.body);
      },
    );

    test(
      'should create a comment with PUT if comment does not exist',
      { tag: ['@GAD-R10-02', '@api', '@put', '@crud'] },
      async ({ request }) => {
        //Arrange 

        const expectedStatusCode = 201;
        const commentData = await prepareCommentPayload(articleId)
        
        const responseCommentPut: APIResponse = await request.put(
          `${apiLinks.commentsUrl}/${new Date().valueOf()}`,
          {
            headers,
            data: commentData,
          },
        );
        
        const responseCommentStatus = responseCommentPut.status();
        expect(
          responseCommentStatus,
          `expect satus code ${expectedStatusCode}, and recieved ${responseCommentStatus}`
        ).toBe(expectedStatusCode);
      }
    );
  },
);
