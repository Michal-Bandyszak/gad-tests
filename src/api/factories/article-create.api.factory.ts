import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiLinks } from '@_src/api/utils/api.utils';
import { expect } from '@_src/ui/fixtures/merge.fixture';
import { APIRequestContext, APIResponse } from '@playwright/test';

interface ArticleDataAndResponse {
  articleData: ArticlePayload;
  responseArticle: APIResponse;
}
export async function createArticleWithApi(
  request: APIRequestContext,
  headers: Headers,
): Promise<ArticleDataAndResponse> {
  const articleData = prepareArticlePayload();
  const responseArticle = await request.post(apiLinks.articlesUrl, {
    headers,
    data: articleData,
  });

  // assert article exist
  const articleJson = await responseArticle.json();
  const expectedStatusCode = 200;
  await expect(async () => {
    const responseArticleCreated = await request.get(
      `${apiLinks.articlesUrl}/${articleJson.id}`,
    );
    expect(
      responseArticleCreated.status(),
      `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
    ).toBe(expectedStatusCode);
  }).toPass({ timeout: 2_000 });

  return { articleData, responseArticle };
}
