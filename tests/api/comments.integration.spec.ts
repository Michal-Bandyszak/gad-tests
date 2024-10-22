import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  CommentData,
  apiLinks,
  getAuthorizationHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.utils';
import { APIResponse } from '@playwright/test';

test.describe('Verify comments CRUD operations @crud @GAD-R09-02', () => {
  let articleId: number;
  let commentId: number;
  let headers;

  test.beforeAll('create an article', async ({ request }) => {
    const articleData = prepareArticlePayload();

    headers = await getAuthorizationHeader(request);
    // Act
    const responseArticle = await request.post(apiLinks.articlesUrl, {
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
  test.describe('crud operations', () => {
    let responseComment: APIResponse;
    let commentData: CommentData;

    test.beforeEach('create a comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId);
      responseComment = await request.post(apiLinks.commentsUrl, {
        headers,
        data: commentData,
      });
      // TODO linked issue
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    test('should  create a comment with a logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 201;

      const commentData = prepareCommentPayload(articleId);

      headers = await getAuthorizationHeader(request);
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
      commentId = comment.id;
      expect.soft(comment.body).toEqual(commentData.body);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    });

    test('should delete a comment with logged-in user GAD-R09-05', async ({
      request,
    }) => {
      // Arrange

      const expectedStatusCode = 200;
      const expDeletedCommentStatusCode = 404;

      // Act
      const responseCommentDelete = await request.delete(
        `${apiLinks.commentsUrl}/${commentId}`,
        {
          headers,
        },
      );

      // Assert
      const actualResponseStatus = responseCommentDelete.status();

      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      // Assert check deleted comment
      const responseCommentGet = await request.get(
        `${apiLinks.commentsUrl}/${commentId}`,
      );
      const commentJson = await responseCommentGet.json();
      commentId = commentJson.id;
      expect(
        responseCommentGet.status(),
        `expected status code ${expDeletedCommentStatusCode}, and received ${responseCommentGet.status()}`,
      ).toBe(expDeletedCommentStatusCode);
    });

    test('should not delete a comment with a non logged-in user @GAD-R08-06', async ({
      request,
    }) => {
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
    });
  });
});
