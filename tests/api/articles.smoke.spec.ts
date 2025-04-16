import { apiLinks } from '@_src/api/utils/api.utils';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe(
  'Verify articles API endpoint',
  { tag: ['@GAD-R08-01', '@smoke'] },
  () => {
    test.describe('Verify each condition in separate test', () => {
      test(
        'GET articles should return an object with required fields',
        { tag: '@predefined_data' },
        async ({ request }) => {
          const response = await request.get(apiLinks.articlesUrl);
          const responseJson = await response.json();

          await test.step('GET articles return status code 200', async () => {
            const expectedStatusCode = 200;

            expect(response.status()).toBe(expectedStatusCode);
          });
          await test.step(
            'GET articles should return at least one article',
            async () => {
              const expectedMinArticleCount = 1;

              expect(responseJson.length).toBeGreaterThanOrEqual(
                expectedMinArticleCount,
              );
            },
          );

          const expectedRequiredFields = [
            'id',
            'body',
            'date',
            'image',
            'user_id',
          ];
          const article = responseJson[0];

          expectedRequiredFields.forEach(async (key) => {
            await test.step(`Response object contains required field: ${key}`, async () => {
              expect.soft(article).toHaveProperty(key);
            });
          });
        },
      );
    });
  },
);
