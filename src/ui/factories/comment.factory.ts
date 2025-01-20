import { AddCommentModel } from '@_src/ui/models/comment.model';
import { faker } from '@faker-js/faker/locale/en';

export function prepareRandomComment(bodySentence = 3): AddCommentModel {
  const body = faker.lorem.sentence(bodySentence);
  const newComment: AddCommentModel = { body: body };

  return newComment;
}
