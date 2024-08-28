import { prepareRandomArticle } from '@_src/factories/article.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { LoginPage } from '@_src/pages/login.page';
import { testUser1 } from '@_src/test-data/user.data';
import test, { expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete Article', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
  });

  test('User can create article with mandatory fields #GAD_R04_01 @S04', async () => {
    // Arrange
    articleData = prepareRandomArticle();
    // Act
    const addArticleView = await articlesPage.clickAddArticleButtonLogged();
    await expect.soft(addArticleView.addNewHeader).toBeVisible();
    await addArticleView.createArticle(articleData);

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);

    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });

  test('User can access single article @GAD-R04-03', async () => {
    // Act
    await articlesPage.gotoArticle(articleData.title);

    // Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });

  test('User can delete added article @GAD-R04-04', async () => {
    // Arrange
    const expectedNoResultText = 'No data';
    const expectedArticlesTitle = 'Articles';
    const articlePage = await articlesPage.gotoArticle(articleData.title);

    // Act
    articlesPage = await articlePage.deleteArticle();

    // Assert
    await articlesPage.waitForPageToLoadURL();
    const title = await articlesPage.getTitle();
    expect(title).toContain(expectedArticlesTitle);

    articlesPage = await articlesPage.searchForArticle(articleData.title);
    await expect(articlesPage.noResultText).toHaveText(expectedNoResultText);
  });
});
