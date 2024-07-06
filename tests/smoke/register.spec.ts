import { randomUserData } from '../../src/factories/user.factory';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify registration', () => {
  test('Register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    // Arrange
    const expectedAlertPopupText = 'User created';
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    const welcomePage = new WelcomePage(page);

    const registerUserData = randomUserData();

    // Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    // Assert
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);

    await loginPage.waitForPageToLoadURL();
    const title = await loginPage.title();
    expect.soft(title).toContain('Login');

    // Assert test login
    await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });

    const titleWelcome = await welcomePage.title();
    expect(titleWelcome).toContain('Welcome');
  });

  test('Not register with incorrect data - non valid email @GAD_R03_04', async ({
    page,
  }) => {
    // Arrange
    const expectedErrorText = 'Please provide a valid email address';
    const registerUserData = randomUserData();
    registerUserData.userEmail = '#$%';
    const registerPage = new RegisterPage(page);

    // Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });
  test('Not register with incorrect data - no email provided @GAD_R03_04', async ({
    page,
  }) => {
    // Arrange
    const expectedErrorText = 'This field is required';
    const registerPage = new RegisterPage(page);
    const registerUserData = randomUserData();

    // Act
    await registerPage.goto();
    await registerPage.firstNameInput.fill(registerUserData.userFirstName);
    await registerPage.lastNameInput.fill(registerUserData.userLastName);
    await registerPage.userPasswordInput.fill(registerUserData.userPassword);
    await registerPage.registerButton.click();

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });
});
