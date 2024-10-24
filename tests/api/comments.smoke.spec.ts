import { apiLinks } from '@_src/api/utils/api.utils';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Verify comments API endpoint @GAD-R08-02 @smoke', () => {
  test.describe('verify each condition in separate test', () => {
    test('GET comments returns status code 200', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200;

      // Act
      const response = await request.get(apiLinks.commentsUrl);

      //Assert`
      expect(response.status()).toBe(expectedStatusCode);
    });

    test('GET comments should return at least one comment @predefined_data', async ({
      request,
    }) => {
      // Arrange
      const expectedCommentsCount = 1;
      // Act
      const response = await request.get(apiLinks.commentsUrl);
      const responseJson = await response.json();

      // Assert
      expect(responseJson.length).toBeGreaterThanOrEqual(expectedCommentsCount);
    });

    test('GET comments return comment object @predefined_data', async ({
      request,
    }) => {
      const response = await request.get(apiLinks.commentsUrl);
      const responseJson = await response.json();

      await expect(
        typeof responseJson,
        'Response should return and object',
      ).toBe('object');
    });

    test('GET comments should return an object with required fields @predefined_data', async ({
      request,
    }) => {
      const expectedRequiredFields = [
        'id',
        'article_id',
        'user_id',
        'body',
        'date',
      ];

      const response = await request.get(apiLinks.commentsUrl);
      const responseJson = await response.json();

      const comment = responseJson[0];

      expectedRequiredFields.forEach((key) => {
        expect
          .soft(comment, `Expected key "${key} should be in object"`)
          .toHaveProperty(key);
      });
    });
  });
});
