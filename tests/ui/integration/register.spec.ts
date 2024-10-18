import { prepareRandomUser } from '@_src/factories/user.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { RegisterUserModel } from '@_src/models/user.model';

test.describe('Verify registration', () => {
  let registerUserData: RegisterUserModel;

  test.beforeEach(async ({}) => {
    registerUserData = prepareRandomUser();
  });

  test('Register with correct data and login @GAD-R03-01 @GAD-R03-02 @GAD-R03-03', async ({
    registerPage,
  }) => {
    // Arrange
    const expectedAlertPopupText = 'User created';
    const expectedWelcomeTitle = 'Welcome';
    const expectedLoginTitle = 'Login';

    // Act
    const loginPage = await registerPage.register(registerUserData);

    // Assert
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);

    await loginPage.waitForPageToLoadURL();
    const title = await loginPage.getTitle();
    expect.soft(title).toContain(expectedLoginTitle);

    // Assert test login
    const welcomePage = await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });

    const titleWelcome = await welcomePage.getTitle();
    expect(titleWelcome).toContain(expectedWelcomeTitle);
  });

  test('Not register with incorrect data - non valid email @GAD-R03-04', async ({
    registerPage,
  }) => {
    // Arrange
    const expectedErrorText = 'Please provide a valid email address';
    registerUserData.userEmail = '#$%';

    // Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });
  test('Not register with incorrect data - no email provided @GAD-R03-04', async ({
    registerPage,
  }) => {
    // Arrange
    const expectedErrorText = 'This field is required';

    // Act
    await registerPage.firstNameInput.fill(registerUserData.userFirstName);
    await registerPage.lastNameInput.fill(registerUserData.userLastName);
    await registerPage.userPasswordInput.fill(registerUserData.userPassword);
    await registerPage.registerButton.click();

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });
});
