import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentWithApi, prepareAndCreateCommentWithApi, prepareAndcreateCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiLinks } from '@_src/api/utils/api.utils';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { Aircraft } from '@faker-js/faker';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comments delete operations',
  { tag: ['@crud', '@api', '@comment', '@delete'] },
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
      responseComment = await prepareAndCreateCommentWithApi(request, headers, articleId);
    });

    test(
      'should delete a comment with logged-in user ',
      { tag: '@GAD-R08-06' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const comment = await responseComment.json();

        // Act
        const responseCommentDeleted = await request.delete(
          `${apiLinks.commentsUrl}/${comment.id}`,
          {
            headers,
          },
        );

        // Assert
        const actualResponseStatus = responseCommentDeleted.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);
      },
    );

    test(
      'should not delete a comment with a non logged-in user ',
      { tag: '@GAD-R08-06' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const comment = await responseComment.json();

        // Act
        const responseCommentNotDeleted = await request.delete(
          `${apiLinks.commentsUrl}/${comment.id}`,
        );

        // Assert
        const actualResponseStatus = responseCommentNotDeleted.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert non deleted comment
        const expectedStatusNotDeletedComment = 200;

        const responseCommentNotDeletedGet = await request.get(
          `${apiLinks.commentsUrl}/${comment.id}`,
        );

        expect(
          responseCommentNotDeletedGet.status(),
          `expect status code ${expectedStatusNotDeletedComment}, and received ${responseCommentNotDeletedGet.status()}`,
        ).toBe(expectedStatusNotDeletedComment);
      },
    );
  },
);
