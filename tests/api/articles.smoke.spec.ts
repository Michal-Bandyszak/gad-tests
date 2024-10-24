import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { apiLinks } from '@_src/ui/utils/api.utils';

test.describe('Verify articles API endpoint @GAD-R08-01 @smoke', () => {
  test.describe('Verify each condition in separate test', () => {
    test('GET articles should return an object with required fields @predefined_data', async ({
      request,
    }) => {
      const response = await request.get(apiLinks.articlesUrl);
      const responseJson = await response.json();

      await test.step('GET articles return status code 200', async () => {
        const expectedStatusCode = 200;

        expect(response.status()).toBe(expectedStatusCode);
      });
      await test.step('GET articles should return at least one article @predefined_data', async () => {
        const expectedMinArticleCount = 1;

        expect(responseJson.length).toBeGreaterThanOrEqual(
          expectedMinArticleCount,
        );
      });

      const expectedRequiredFields = ['id', 'body', 'date', 'image', 'user_id'];
      const article = responseJson[0];

      expectedRequiredFields.forEach(async (key) => {
        await test.step(`Response object contains required field: ${key}`, async () => {
          expect.soft(article).toHaveProperty(key);
        });
      });
    });
  });
});
