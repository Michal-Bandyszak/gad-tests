import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class ArticlePage extends BasePage {
  url = '/article.html';
  articleTitle = this.page.getByTestId('article-title');
  articleBody = this.page.getByTestId('article-body');
  constructor(page: Page) {
    super(page);
  }
}
