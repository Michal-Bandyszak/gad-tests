import { MainMenuComponent } from '@_src/components/main-menu.component';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { expect, test } from '@playwright/test';

test.describe('Verify menu main button', () => {
  test('comments button navigates to comments page @GAD-R01-03', async ({
    page,
  }) => {
    //Arrange
    const expectedCommentsTitle = 'Comments';
    const articlesPage = new ArticlesPage(page);
    const menuComponent = new MainMenuComponent(page);

    //Act
    await articlesPage.goto();
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
