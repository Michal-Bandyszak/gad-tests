import { prepareRandomArticle } from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import test, { expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let commentView: AddCommentView;
  let commentPage: CommentPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);
    commentView = new AddCommentView(page);
    commentPage = new CommentPage(page);

    articleData = prepareRandomArticle();

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test('User can create comment @GAD-R06-02', async () => {
    // Arrange
    const expectedAddCommentHeader = 'Add New Comment';
    const expectedCommentCreatedPopup = 'Comment was created';

    const newCommentData = prepareRandomArticle();
    
    // Act
    await articlePage.addCommentButton.click();
    await expect(commentView.addNewHeader).toHaveText(expectedAddCommentHeader);
    await commentView.bodyInput.fill(newCommentData.body);
    await commentView.saveButton.click();
    //Assert

    await expect(articlePage.alertPopup).toHaveText(
      expectedCommentCreatedPopup,
    );
    //Verify comment
    // Act
    const articleComment = articlePage.getArticleComment(newCommentData.body);

    await expect(articleComment.body).toHaveText(newCommentData.body);
    await articleComment.link.click();
    // Assert
    await expect(commentPage.commentBody).toHaveText(newCommentData.body);
  });
});
