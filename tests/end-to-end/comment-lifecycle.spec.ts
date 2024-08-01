import { prepareRandomArticle } from '../../src/factories/article.factory';
import { prepareRandomComment } from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import { EditCommentView } from '../../src/views/edit-comment.view';
import test, { expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;
  let editCommentView: EditCommentView;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);
    editCommentView = new EditCommentView(page);

    articleData = prepareRandomArticle();

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test('Working on comments @GAD-R06-01 @GAD-R06-02', async () => {
    const expectedAddCommentHeader = 'Add New Comment';
    const expectedCommentCreatedPopup = 'Comment was created';
    const expectedCommentEditedPopup = 'Comment was updated';
    const newCommentData = prepareRandomComment();

    await test.step('User can create comment', async () => {
      // Arrange

      // Act
      await articlePage.addNewCommentButton.click();
      await expect
        .soft(addCommentView.addNewHeader)
        .toHaveText(expectedAddCommentHeader);

      await addCommentView.createComment(newCommentData);
      //Assert

      await expect(articlePage.alertPopup).toHaveText(
        expectedCommentCreatedPopup,
      );
    });

    await test.step('User can verify comment', async () => {
      // Act
      const articleComment = articlePage.getArticleComment(newCommentData.body);

      await expect.soft(articleComment.body).toHaveText(newCommentData.body);
      await articleComment.link.click();
      // Assert
      await expect(commentPage.commentBody).toHaveText(newCommentData.body);
    });

    const editCommentData = prepareRandomComment();
    await test.step('User can edit comment', async () => {
      await commentPage.editButton.click();
      await editCommentView.updateComment(editCommentData);

      await expect
        .soft(commentPage.commentBody)
        .toHaveText(editCommentData.body);
      await expect(commentPage.alertPopup).toHaveText(
        expectedCommentEditedPopup,
      );
    });
    await test.step('User can verify edited comment', async () => {
      await commentPage.returnLink.click();
      const updatedArticleComment = articlePage.getArticleComment(
        editCommentData.body,
      );
      await expect(updatedArticleComment.body).toHaveText(editCommentData.body);
    });
  });

  test('Working on comments @GAD-R06-03', async () => {
    await test.step('User can create first comment', async () => {
      // Arrange
      const expectedCommentCreatedPopup = 'Comment was created';
      const newCommentData = prepareRandomComment();

      // Act
      await articlePage.addNewCommentButton.click();

      await addCommentView.createComment(newCommentData);
      //Assert

      await expect(articlePage.alertPopup).toHaveText(
        expectedCommentCreatedPopup,
      );
    });

    await test.step('Create & verify second comment', async () => {
      const secondCommentData = prepareRandomComment();
      const secondCommentBody = await test.step('Create comment', async () => {
        await articlePage.addNewCommentButton.click();
        await addCommentView.createComment(secondCommentData);
        return secondCommentData.body;
      });

      await test.step('Verify comment', async () => {
        const articleComment = articlePage.getArticleComment(secondCommentBody);
        await expect(articleComment.body).toHaveText(secondCommentBody);
      });
    });
  });
});
