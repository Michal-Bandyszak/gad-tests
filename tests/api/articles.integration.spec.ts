import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { getAuthorizationBearer } from '@_src/utils/api.utils';

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

    const articleUrl = '/api/articles';

    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-10-16T15:00:31Z',
      image:
        '.\\data\\images\\256\\testing_app_0b34c17e-fe37-4887-a127-d0ee6eb9d7dc.jp',
    };

    // Act
    const headers = await getAuthorizationBearer(request);

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
