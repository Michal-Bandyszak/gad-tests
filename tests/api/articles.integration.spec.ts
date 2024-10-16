import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

test.describe('Verify articles CRUD operations @api', () => {
  test('should not create an article without a logged-in user @GAD-R09-01', async ({
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
      image: '',
    };

    // Act

    // Login
    const loginResponse = await request.post(loginUrl, { data: userData });
    const responseBody = await loginResponse.json();

    const headers = { Authorization: `Bearer ${responseBody.access_token}` };

    const responseArticle = await request.post(articleUrl, {
      headers,
      data: articleData,
    });

    // Assert
    expect(responseArticle.status()).toBe(expectedStatusCode);
  });
});
