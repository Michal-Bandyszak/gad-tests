import { randomNewArticle } from '../../src/factories/article.factory';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify Articles', () => {
  test('User can create article with mandatory fields #GAD_R04_01 @S04', async ({
    page,
  }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const articlesPage = new ArticlesPage(page);
    const addArticleView = new AddArticleView(page);
    const articlePage = new ArticlePage(page);

    const articleData = randomNewArticle();

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();

    // Act
    await articlesPage.addArticleButtonLogged.click();
    await expect.soft(addArticleView.header).toBeVisible();
    await addArticleView.createArticle(articleData);

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });

  test('Reject creating article without title field #GAD_R04_01 @S04', async ({
    page,
  }) => {
    // Arrange
    const expectedErrorText = 'Article was not created';
    const loginPage = new LoginPage(page);
    const articlesPage = new ArticlesPage(page);
    const addArticleView = new AddArticleView(page);

    const articleData = randomNewArticle();
    articleData.title = '';

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();

    //Act
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
  });
  test('Reject creating article without body field #GAD_R04_01 @S04', async ({
    page,
  }) => {
    // Arrange
    const expectedErrorText = 'Article was not created';
    const loginPage = new LoginPage(page);
    const articlesPage = new ArticlesPage(page);
    const addArticleView = new AddArticleView(page);

    const articleData = randomNewArticle();
    articleData.body = '';

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();

    //Act
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
  });
});
