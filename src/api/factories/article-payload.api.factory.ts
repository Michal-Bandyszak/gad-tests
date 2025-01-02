import { ArticlePayload } from '../models/article.api.model';
import { prepareRandomArticle } from '@_src/ui/factories/article.factory';

export function prepareArticlePayload(): ArticlePayload {
  const randomArticleData = prepareRandomArticle();
  const articleData = {
    title: randomArticleData.title,
    body: randomArticleData.body,
    date: new Date().toISOString(),
    image:
      '.\\data\\images\\256\\testing_app_0b34c17e-fe37-4887-a127-d0ee6eb9d7dc.jp',
  };

  return articleData;
}
