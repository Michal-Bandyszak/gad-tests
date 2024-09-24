import { expect, test as baseTest } from '@playwright/test';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { HomePage } from '@_src/pages/home.page';

interface Pages {
  articlesPage: ArticlesPage;
  commentsPage: CommentsPage;
  homePage: HomePage
}

export const pageObjectTest = baseTest.extend<Pages>({
  articlesPage: async({page}, use) => {
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await use(articlesPage);
  },
  commentsPage: async({page}, use) => {
    const commentsPage = new CommentsPage(page);
    await commentsPage.goto();
    await use(commentsPage);
  },
  homePage: async({page}, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage)
  }
})
