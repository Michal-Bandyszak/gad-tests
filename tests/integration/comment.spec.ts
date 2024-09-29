import { prepareRandomComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { waitForResponse } from '@_src/utils/wait.util';

test.describe('Create, verify comment', () => {
  test('should return created comment from API @GAD-R07-04 @logged', async ({
    createRandomArticle,
    page,
  }) => {
    // Arrange
    const expectedCommentCreatedPopup = 'Comment was created';
    const newCommentData = prepareRandomComment();
    let articlePage = createRandomArticle.articlePage;
    const addCommentView = await articlePage.clickAddCommentButton();

    // Act
    articlePage = await addCommentView.createComment(newCommentData);
    const responsePromise = waitForResponse(page, '/api/comments', 'GET');
    await expect(articlePage.alertPopup).toBeVisible({ timeout: 5000 });
    await expect
      .soft(articlePage.alertPopup)
      .toHaveText(expectedCommentCreatedPopup);

    const response = await responsePromise;

    // Assert
    expect(response.ok()).toBeTruthy();
  });
});
