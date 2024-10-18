import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

test.describe('Verify comments CRUD operations @api @GAD-R09-02', () => {
  let articleId: number;
  let headers: { [key: string]: string };

  test.beforeAll('create an article', async ({ request }) => {
    const loginUrl = '/api/login';
    const userData = {
      email: testUser1.userEmail,
      password: testUser1.userPassword,
    };
    const articleUrl = '/api/articles';
    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-10-16T15:00:31Z',
      image:
        '.\\data\\images\\256\\testing_app_0b34c17e-fe37-4887-a127-d0ee6eb9d7dc.jp',
    };

    // Login
    const loginResponse = await request.post(loginUrl, { data: userData });
    const responseBody = await loginResponse.json();

    headers = { Authorization: `Bearer ${responseBody.access_token}` };

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
