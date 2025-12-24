import { getAccessToken } from '@/services/auth/token.service';

export type RequestInterceptor = (
  input: RequestInfo,
  init?: RequestInit,
) => Promise<[RequestInfo, RequestInit]>;

export type ResponseInterceptor = (response: Response) => Promise<Response>;

export const requestInterceptor: RequestInterceptor = async (
  input,
  init = {},
) => {
  const token = await getAccessToken();

  const headers = new Headers(init.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Only set JSON content-type when we actually send a JSON string body.
  // Avoid breaking FormData / file uploads.
  if (
    typeof init.body === 'string' &&
    !headers.has('Content-Type') &&
    !headers.has('content-type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  return [
    input,
    {
      ...init,
      headers,
      credentials: init.credentials ?? 'include',
    },
  ];
};

export const responseInterceptor: ResponseInterceptor = async (response) => {
  if (!response.ok) {
    throw response;
  }

  return response;
};
