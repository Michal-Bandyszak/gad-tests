import { AddCommentModel } from '@_src/ui/models/comment.model';
import { ArticlePage } from '@_src/ui/pages/article.page';
import { Page } from '@playwright/test';

export class AddCommentView {
  addNewHeader = this.page.getByRole('heading', { name: 'Add New Comment' });
  bodyInput = this.page.locator('#body');
  saveButton = this.page.getByRole('button', { name: 'Save' });

  async createComment(newCommentData: AddCommentModel): Promise<ArticlePage> {
    await this.bodyInput.fill(newCommentData.body);
    await this.saveButton.click();
    return new ArticlePage(this.page);
  }

  constructor(private page: Page) {}
}
