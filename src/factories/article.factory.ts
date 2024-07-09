import { AddArticleModel } from '../models/article.model';
import { faker } from '@faker-js/faker/locale/en';

export function randomNewArticle(titleLength?: number): AddArticleModel {
  let title: string;
  if (titleLength) title = faker.string.alpha(titleLength);
  else title = faker.lorem.sentence();
  
  const body = faker.lorem.paragraphs(3);

  const newArticle: AddArticleModel = { title: title, body: body };
  return newArticle;
}
