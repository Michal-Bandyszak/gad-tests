import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

test.describe('Verify articles CRUD operations @crud @GAD-R09-01', () => {
  test('should not create an article without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articleUrl = '/api/articles';
    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-10-16T15:00:31Z',
      image: '',
    };

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
    const loginUrl = '/api/login';
    const articleUrl = '/api/articles';
    const userData = {
      email: testUser1.userEmail,
      password: testUser1.userPassword,
    };

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

    const headers = { Authorization: `Bearer ${responseBody.access_token}` };
    // Act
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
