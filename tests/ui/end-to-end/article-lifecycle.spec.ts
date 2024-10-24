import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { AddArticleModel } from '@_src/ui/models/article.model';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete Article', () => {
  let articleData: AddArticleModel;

  test('create new article @GAD-R04-01 @logged', async ({
    createRandomArticle,
  }) => {
    // Arrange
    articleData = createRandomArticle.articleData;

    // Act

    const articlePage = createRandomArticle.articlePage;

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);

    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });

  test('User can access single article @GAD-R04-03 @logged', async ({
    articlesPage,
  }) => {
    // Act
    const articlePage = await articlesPage.gotoArticle(articleData.title);

    // Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });

  test('User can delete added article @GAD-R04-04 @logged', async ({
    articlesPage,
  }) => {
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
