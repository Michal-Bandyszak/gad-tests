import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { LoginUserModel } from '@_src/ui/models/user.model';
import { testUser1 } from '@_src/ui/test-data/user.data';

test.describe('Verify login', () => {
  test(
    'User login test with correct credentials',
    { tag: '@GAD-R02-01' },
    async ({ loginPage }) => {
      // Arrange
      const expectedWelcomeTitle = 'Welcome';

      // Act
      const welcomePage = await loginPage.login(testUser1);
      const title = await welcomePage.getTitle();

      //Assert
      expect(title).toContain(expectedWelcomeTitle);
    },
  );

  test(
    'Reject login test with incorrect password',
    {
      tag: '@GAD-R02-01',
      annotation: {
        type: 'Happy path',
        description: 'Basic happy path test for login',
      },
    },
    async ({ loginPage }) => {
      // Arrange
      const expectedLoginError = 'Invalid username or password';
      const expectedLoginTitle = 'Login';
      const loginUserData: LoginUserModel = {
        userEmail: testUser1.userEmail,
        userPassword: 'Incorrect password',
      };

      // Act
      await loginPage.login(loginUserData);

      //Assert
      await expect.soft(loginPage.loginError).toHaveText(expectedLoginError);
      const title = await loginPage.getTitle();
      expect(title).toContain(expectedLoginTitle);
    },
  );
});
