import { prepareRandomArticle } from '@_src/factories/article.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { ArticlesPage } from '@_src/pages/articles.page';
import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete Article', () => {
  let articleData: AddArticleModel;

  test('create new article @GAD-R04-01 @logged', async ({addArticleView}) => {
    // Arrange
    articleData = prepareRandomArticle();
    // Act
    await expect.soft(addArticleView.addNewHeader).toBeVisible();
    const articlePage = await addArticleView.createArticle(articleData);

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);

    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });

  test('User can access single article @GAD-R04-03 @logged', async ({articlesPage}) => {
    // Act
    const articlePage = await articlesPage.gotoArticle(articleData.title);

    // Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });

  test('User can delete added article @GAD-R04-04 @logged', async ({articlesPage}) => {
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
