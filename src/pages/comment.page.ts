import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  commentBody = this.page.getByTestId('comment-body');

  constructor(page: Page) {
    super(page);
  }
}
