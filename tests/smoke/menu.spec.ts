import { MainMenuComponent } from '../../src/components/main-menu.component';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentsPage } from '../../src/pages/comments.page';
import { expect, test } from '@playwright/test';

test.describe('Verify menu main button', () => {
  test('comments button navigates to comments page @GAD_R01_03', async ({
    page,
  }) => {
    //Arrange
    const commentsPage = new CommentsPage(page);
    const articlesPage = new ArticlesPage(page);
    const menuComponent = new MainMenuComponent(page);

    //Act
    await articlesPage.goto();
    await menuComponent.commentsButton.click();

    //Assert
    const title = await commentsPage.title();
    expect(title).toContain('Comments');
  });

  test('articles button navigates to articles page @GAD_R01_03', async ({
    page,
  }) => {
    //Arrange
    const articlesPage = new ArticlesPage(page);
    const commentsPage = new CommentsPage(page);

    const menuComponent = new MainMenuComponent(page);

    //Act
    await commentsPage.goto();
    await menuComponent.articlesButton.click();

    //Assert
    const title = await articlesPage.title();
    expect(title).toContain('Articles');
  });
});
