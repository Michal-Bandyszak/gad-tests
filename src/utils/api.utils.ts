import { testUser1 } from '@_src/test-data/user.data';
import { APIRequestContext } from '@playwright/test';

interface Headers {
  [key: string]: string;
}

export async function getAuthorizationBearer(
  request: APIRequestContext,
): Promise<Headers> {
  const loginUrl = '/api/login';
  const userData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };
  // Login
  const loginResponse = await request.post(loginUrl, { data: userData });
  const responseBody = await loginResponse.json();

  const headers = { Authorization: `Bearer ${responseBody.access_token}` };

  return headers;
}
