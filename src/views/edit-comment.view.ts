import { AddCommentModel } from '../models/comment.model';
import { Page } from '@playwright/test';

export class EditCommentView {
  bodyInput = this.page.locator('#body');
  updateButton = this.page.getByRole('button', { name: 'Update' });

  async updateComment(commentData: AddCommentModel): Promise<void> {
    await this.bodyInput.fill(commentData.body);
    await this.updateButton.click();
  }

  constructor(private page: Page) {}
}
