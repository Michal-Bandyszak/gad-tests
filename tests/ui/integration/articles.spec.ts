import { prepareRandomArticle } from '@_src/ui/factories/article.factory';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { waitForResponse } from '@_src/ui/utils/wait.util';

test.describe('Verify articles', () => {
  test(
    'reject creating article without title',
    { tag: ['@GAD-R04-01 @GAD-R07-03 @logged'] },
    async ({ addArticleView, page }) => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const expectedResponseCode = 422;

      const articleData = prepareRandomArticle();
      articleData.title = '';

      const responsePromise = waitForResponse({ page, url: '/api/articles' });
      // Act
      await addArticleView.createArticle(articleData);
      const response = await responsePromise;

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
      expect(response.status()).toBe(expectedResponseCode);
    },
  );

  test(
    'reject creating article without body',
    { tag: ['@GAD-R04-01 @GAD-R07-03 @logged'] },
    async ({ addArticleView, page }) => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const expectedResponseCode = 422;
      const articleData = prepareRandomArticle();
      articleData.body = '';

      const responsePromise = waitForResponse({ page, url: '/api/articles' });
      // Act
      await addArticleView.createArticle(articleData);
      const response = await responsePromise;
      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
      expect(response.status()).toBe(expectedResponseCode);
    },
  );

  test.describe('title length', () => {
    test(
      'reject creating article with title exceeding 128 signs',
      { tag: [' @GAD-R04-02 @GAD-R07-03 @logged'] },
      async ({ addArticleView, page }) => {
        // Arrange
        const expectedErrorMessage = 'Article was not created';
        const expectedResponseCode = 422;
        const articleData = prepareRandomArticle(129);

        // Act
        const responsePromise = waitForResponse({ page, url: '/api/articles' });
        await addArticleView.createArticle(articleData);
        const response = await responsePromise;
        // Assert
        await expect(addArticleView.alertPopup).toHaveText(
          expectedErrorMessage,
        );
        expect(response.status()).toBe(expectedResponseCode);
      },
    );

    test(
      'create article with title with 128 signs',
      { tag: [' @GAD-R04-02 @logged'] },
      async ({ addArticleView }) => {
        // Arrange
        const articleData = prepareRandomArticle(128);

        // Act
        const articlePage = await addArticleView.createArticle(articleData);

        // Assert
        await expect
          .soft(articlePage.articleTitle)
          .toHaveText(articleData.title);
      },
    );
    test(
      'should return created article from API',
      { tag: ['@GAD-R07-04 @logged'] },
      async ({ addArticleView, page }) => {
        // Arrange
        const articleData = prepareRandomArticle();
        const responsePromise = waitForResponse({
          page,
          url: '/api/articles',
          method: 'GET',
        });

        // Act
        const articlePage = await addArticleView.createArticle(articleData);
        const response = await responsePromise;

        // Assert
        await expect
          .soft(articlePage.articleTitle)
          .toHaveText(articleData.title);
        expect(response.ok()).toBeTruthy();
      },
    );
  });
});
