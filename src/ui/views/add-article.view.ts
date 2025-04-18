import { AddArticleModel } from '@_src/ui/models/article.model';
import { ArticlePage } from '@_src/ui/pages/article.page';
import { Page } from '@playwright/test';

export class AddArticleView {
  addArticleButtonLogged = this.page.locator('#add-new');
  addNewHeader = this.page.getByRole('heading', { name: 'Add New Entry' });
  titleInput = this.page.getByTestId('title-input');
  bodyInput = this.page.getByTestId('body-text');
  saveButton = this.page.getByTestId('save');

  alertPopup = this.page.getByTestId('alert-popup');

  constructor(private page: Page) {}

  async createArticle(addArticle: AddArticleModel): Promise<ArticlePage> {
    await this.titleInput.fill(addArticle.title);
    await this.bodyInput.fill(addArticle.body);
    await this.saveButton.click();
    return new ArticlePage(this.page);
  }
}
