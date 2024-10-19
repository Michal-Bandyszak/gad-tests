import { prepareRandomArticle } from '@_src/factories/article.factory';
import { testUser1 } from '@_src/test-data/user.data';
import { APIRequestContext } from '@playwright/test';

interface Headers {
  [key: string]: string;
}

export async function getAuthorizationBearer(
  request: APIRequestContext,
): Promise<Headers> {
  const loginUrl = '/api/login';
  const userData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };
  // Login
  const loginResponse = await request.post(loginUrl, { data: userData });
  const responseBody = await loginResponse.json();

  const headers = { Authorization: `Bearer ${responseBody.access_token}` };

  return headers;
}

interface ArticleData {
  title: string;
  body: string;
  date: string;
  image: string;
}

export function prepareArticlePayload(): ArticleData {
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
