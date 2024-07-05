import { AddArticleModel } from '../models/article.model';
import { faker } from '@faker-js/faker/locale/en';

export function randomNewArticle(): AddArticleModel {
  const title = faker.lorem.words({ min: 2, max: 5 });
  const body = faker.lorem.paragraphs(3);

  const newArticle: AddArticleModel = { title: title, body: body };
  return newArticle;
}
