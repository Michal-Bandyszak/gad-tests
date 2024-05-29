import { randomUserData } from '../../src/factories/user.factory';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';
import { expect, test } from '@playwright/test';

test.describe('Verify registration', () => {
  test('Register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    const registerUserData = randomUserData();
    const registerPage = new RegisterPage(page);

    // Act
    await registerPage.goto();
    await registerPage.register(registerUserData);
    const expectedAlertPopupText = 'User created';

    //Assert
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);
    const loginPage = new LoginPage(page);
    await loginPage.waitForPageToLoadURL();
    const title = await loginPage.title();
    expect.soft(title).toContain('Login');
  });
  test('Not register with incorrect data - non valid email @GAD_R03_04', async ({
    page,
  }) => {
    // Arrange
    const registerUserData = randomUserData();
    registerUserData.userEmail = '#$%';

    const expectedErrorText = 'Please provide a valid email address';
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
    const registerUserData = randomUserData();
    const expectedErrorText = 'This field is required';
    const registerPage = new RegisterPage(page);

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
