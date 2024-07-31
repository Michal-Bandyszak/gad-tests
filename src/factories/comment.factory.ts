import { AddCommentModel } from '../models/comment.model';
import { faker } from '@faker-js/faker/locale/en';

export function prepareRandomComment(bodySentence = 5): AddCommentModel {
  const body = faker.lorem.paragraphs(bodySentence);
  const newComment: AddCommentModel = { body: body };

  return newComment;
}
