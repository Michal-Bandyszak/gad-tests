import { prepareRandomArticle } from '@_src/factories/article.factory';
import { ArticlesPage } from '@_src/pages/articles.page';
import { AddArticleView } from '@_src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify Article', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    addArticleView = await articlesPage.clickAddArticleButtonLogged();

    await expect.soft(addArticleView.addNewHeader).toBeVisible();
  });

  test('reject creating an article without title @GAD-R04-01 @logged', async () => {
    // Arrange
    const expectedErrorMessage = 'Article was not created';
    const articleData = prepareRandomArticle();
    articleData.title = '';

    // Act
    await addArticleView.createArticle(articleData);

    // Assert

    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
  });

  test('reject creating an article without body @GAD-R04-01 @logged', async () => {
    // Arrange
    const expectedErrorMessage = 'Article was not created';
    const articleData = prepareRandomArticle();
    articleData.body = '';

    // Act
    await addArticleView.createArticle(articleData);

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
  });

  test.describe('title length', () => {
    test('reject creating article with title exceeding 128 signs @GAD-R04-02 @logged', async () => {
      //Arrange
      const expectedErrorMessage = 'Article was not created';
      const articleData = prepareRandomArticle(129);

      // Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    });
    test('create article with title length of 128 signs @GAD-R04-02 @logged', async () => {
      // Arrange
      const articleData = prepareRandomArticle(128);
      // Act
      const articlePage = await addArticleView.createArticle(articleData);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    });
  });
});
