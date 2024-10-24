import { Headers } from '@_src/api/models/headers.api.model';
import { apiLinks } from '@_src/api/utils/api.utils';
import { testUser1 } from '@_src/ui/test-data/user.data';
import { APIRequestContext } from '@playwright/test';

export async function getAuthorizationHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const userData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };
  // Login
  const loginResponse = await request.post(apiLinks.loginUrl, {
    data: userData,
  });
  const responseBody = await loginResponse.json();

  const headers = { Authorization: `Bearer ${responseBody.access_token}` };

  return headers;
}
