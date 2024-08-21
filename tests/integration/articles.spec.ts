import { prepareRandomArticle } from '../../src/factories/article.factory';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { AddArticleView } from '../../src/views/add-article.view';
// import { testUser1 } from '../../src/test-data/user.data';
import { expect, test } from '@playwright/test';

test.describe('Verify Article', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);

    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();

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
      const expectedErrorMessage = 'Article was not created';
      const articleData = prepareRandomArticle(129);

      await articlesPage.addArticleButtonLogged.click();
      await expect.soft(addArticleView.addNewHeader).toBeVisible();

      // Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    });
    test('create article with title length of 128 signs @GAD-R04-02 @logged', async ({
      page,
    }) => {
      // Arrange
      const articlePage = new ArticlePage(page);
      const articleData = prepareRandomArticle(128);
      // Act
      await expect.soft(addArticleView.addNewHeader).toBeVisible();

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    });
  });
});
