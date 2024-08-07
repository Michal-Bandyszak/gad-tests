import { LoginUserModel } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { testUser1 } from '../../src/test-data/user.data';
import { expect, test } from '@playwright/test';

test.describe('Verify login', () => {
  test('User login test with correct credentials @GAD-R02-01', async ({
    page,
  }) => {
    // Arrange
    const expectedWelcomeTitle = 'Welcome';
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(testUser1);

    const welcomePage = new WelcomePage(page);
    const title = await welcomePage.getTitle();

    //Assert
    expect(title).toContain(expectedWelcomeTitle);
  });

  test('Reject login test with incorrect password @GAD-R02-01', async ({
    page,
  }) => {
    // Arrange
    const expectedLoginError = 'Invalid username or password';
    const expectedLoginTitle = 'Login';
    const loginUserData: LoginUserModel = {
      userEmail: testUser1.userEmail,
      userPassword: 'Incorrect password',
    };
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Act
    await loginPage.login(loginUserData);

    //Assert
    await expect.soft(loginPage.loginError).toHaveText(expectedLoginError);
    const title = await loginPage.getTitle();
    expect(title).toContain(expectedLoginTitle);
  });
});
