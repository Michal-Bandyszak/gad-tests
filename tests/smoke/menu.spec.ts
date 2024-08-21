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
    const commentsPage = new CommentsPage(page);
    const articlesPage = new ArticlesPage(page);
    const menuComponent = new MainMenuComponent(page);

    //Act
    await articlesPage.goto();
    await menuComponent.commentsButton.click();

    //Assert
    const title = await commentsPage.getTitle();
    expect(title).toContain(expectedCommentsTitle);
  });

  test('articles button navigates to articles page @GAD-R01-03', async ({
    page,
  }) => {
    //Arrange
    const expectedArticlesTitle = 'Articles';
    const articlesPage = new ArticlesPage(page);
    const commentsPage = new CommentsPage(page);
    const menuComponent = new MainMenuComponent(page);

    //Act
    await commentsPage.goto();
    await menuComponent.articlesButton.click();

    //Assert
    const title = await articlesPage.getTitle();
    expect(title).toContain(expectedArticlesTitle);
  });
});
