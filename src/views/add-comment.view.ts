import { AddCommentModel } from '../models/comment.model';
import { Page } from '@playwright/test';

export class AddCommentView {
  addNewHeader = this.page.getByRole('heading', { name: 'Add New Comment' });
  bodyInput = this.page.locator('#body');
  saveButton = this.page.getByRole('button', { name: 'Save' });

  async createComment(newCommentData: AddCommentModel): Promise<void> {
    await this.bodyInput.fill(newCommentData.body);
    await this.saveButton.click();
  }

  constructor(private page: Page) {}
}
