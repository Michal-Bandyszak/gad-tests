import { MainMenuComponent } from '@_src/components/main-menu.component';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { expect, test as baseTest } from '@playwright/test';

const test = baseTest.extend<{articlesPage: ArticlesPage}>({
  articlesPage: async({page}, use) => {
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await use(articlesPage);
  },
})

test.describe('Verify menu main button', () => {
  test('comments button navigates to comments page @GAD-R01-03', async ({
    articlesPage, page
  }) => {
    //Arrange
    const expectedCommentsTitle = 'Comments';
    const menuComponent = new MainMenuComponent(page);

    //Act
    const commentsPage = await menuComponent.clickCommentButton();
    const title = await commentsPage.getTitle();

    //Assert
    expect(title).toContain(expectedCommentsTitle);
  });

  test('articles button navigates to articles page @GAD-R01-03', async ({
    page,
  }) => {
    //Arrange
    const expectedArticlesTitle = 'Articles';
    const commentsPage = new CommentsPage(page);
    const menuComponent = new MainMenuComponent(page);

    //Act
    await commentsPage.goto();
    const articlesPage = await menuComponent.clickArticlesButton();
    const title = await articlesPage.getTitle();

    //Assert
    expect(title).toContain(expectedArticlesTitle);
  });

  test('home page button navigates to main page @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const expectedHomePageTitle = 'GAD';
    const articlesPage = new ArticlesPage(page);
    // Act
    await articlesPage.goto();
    const homepage = await articlesPage.mainMenu.clickHomePageButton();
    const title = await homepage.getTitle();

    // Assert
    expect(title).toContain(expectedHomePageTitle);
  });
});
