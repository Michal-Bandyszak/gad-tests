import { randomNewArticle } from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify Articles', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articleData = randomNewArticle();

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();

    await articlesPage.addArticleButtonLogged.click();
    await expect.soft(addArticleView.header).toBeVisible();
  });

  test('User can create article with mandatory fields #GAD_R04_01 @S04', async ({
    page,
  }) => {
    // Arrange
    const articlePage = new ArticlePage(page);

    // Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });

  test('Reject creating article without title field #GAD_R04_01 @S04', async () => {
    // Arrange
    const expectedErrorText = 'Article was not created';
    articleData.title = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
  });

  test('Reject creating article without body field #GAD_R04_01 @S04', async () => {
    // Arrange
    const expectedErrorText = 'Article was not created';

    const articleData = randomNewArticle();
    articleData.body = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
  });
});
