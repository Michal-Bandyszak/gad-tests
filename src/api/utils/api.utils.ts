import { prepareRandomArticle } from '@_src/ui/factories/article.factory';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { testUser1 } from '@_src/ui/test-data/user.data';
import { APIRequestContext } from '@playwright/test';

export interface ArticlePayload {
  title: string;
  body: string;
  date: string;
  image: string;
}
export interface CommentPayload {
  body: string;
  date: string;
  article_id: number;
}
export interface Headers {
  [key: string]: string;
}

export const apiLinks = {
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
  loginUrl: '/api/login',
};

export async function getAuthorizationHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const userData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };
  // Login
  const loginResponse = await request.post(apiLinks.loginUrl, {
    data: userData,
  });
  const responseBody = await loginResponse.json();

  const headers = { Authorization: `Bearer ${responseBody.access_token}` };

  return headers;
}

export function prepareArticlePayload(): ArticlePayload {
  const randomArticleData = prepareRandomArticle();
  const articleData = {
    title: randomArticleData.title,
    body: randomArticleData.body,
    date: '2024-10-16T15:00:31Z',
    image:
      '.\\data\\images\\256\\testing_app_0b34c17e-fe37-4887-a127-d0ee6eb9d7dc.jp',
  };

  return articleData;
}

export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment();
  const commentData = {
    body: randomCommentData.body,
    date: '2024-10-16T15:00:31Z',
    article_id: articleId,
  };

  return commentData;
}
