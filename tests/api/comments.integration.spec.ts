import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { getAuthorizationBearer } from '@_src/utils/api.utils';

test.describe('Verify comments CRUD operations @crud @GAD-R09-02', () => {
  let articleId: number;
  let headers;
  test.beforeAll('create an article', async ({ request }) => {
    const articleUrl = '/api/articles';
    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-10-16T15:00:31Z',
      image:
        '.\\data\\images\\256\\testing_app_0b34c17e-fe37-4887-a127-d0ee6eb9d7dc.jp',
    };

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
    const randomCommentData = prepareRandomComment();
    const commentData = {
      body: randomCommentData.body,
      date: '2024-10-16T15:00:31Z',
      article_id: 1,
    };

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

    const randomCommentData = prepareRandomComment();

    const commentData = {
      article_id: articleId,
      body: randomCommentData.body,
      date: '2024-10-16T15:00:31Z',
    };
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
