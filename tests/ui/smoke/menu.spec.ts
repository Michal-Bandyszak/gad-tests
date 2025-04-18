import { MainMenuComponent } from '@_src/ui/components/main-menu.component';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Verify menu main button', () => {
  test('comments button navigates to comments page @GAD-R01-03', async ({
    page,
  }) => {
    //Arrange
    const expectedCommentsTitle = 'Comments';
    const menuComponent = new MainMenuComponent(page);

    //Act
    await page.goto('/Articles');
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
    const menuComponent = new MainMenuComponent(page);

    //Act
    await page.goto('/Comments');
    const articlesPage = await menuComponent.clickArticlesButton();
    const title = await articlesPage.getTitle();

    //Assert
    expect(title).toContain(expectedArticlesTitle);
  });

  test('home page button navigates to main page @GAD-R01-03', async ({
    articlesPage,
  }) => {
    // Arrange
    const expectedHomePageTitle = 'GAD';

    // Act
    const homepage = await articlesPage.mainMenu.clickHomePageButton();
    const title = await homepage.getTitle();

    // Assert
    expect(title).toContain(expectedHomePageTitle);
  });
});
