import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  commentBody = this.page.getByTestId('comment-body');
  editButton = this.page.getByTestId('edit');
  alertPopup = this.page.getByTestId('alert-popup');
  returnLink = this.page.getByTestId('return');
  constructor(page: Page) {
    super(page);
  }
}
