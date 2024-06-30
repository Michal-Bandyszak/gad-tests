import { LoginUser } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { testUser1 } from '../../src/test-data/user.data';
import { expect, test } from '@playwright/test';

test.describe('Verify login', () => {
  test('User login test with correct credentials @GAD_R02_01', async ({
    page,
  }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(testUser1);

    const welcomePage = new WelcomePage(page);
    const title = await welcomePage.title();

    //Assert
    expect(title).toContain('Welcome');
  });

  test('Reject login test with incorrect password @GAD_R02_01', async ({
    page,
  }) => {
    // Arrange
    const loginUserData: LoginUser = {
      userEmail: testUser1.userEmail,
      userPassword: 'Incorrect password',
    };
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Act
    await loginPage.login(loginUserData);

    //Assert
    await expect
      .soft(loginPage.loginError)
      .toHaveText('Invalid username or password');
    const title = await loginPage.title();
    expect(title).toContain('Login');
  });
});
