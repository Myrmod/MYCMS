import * as cookie from 'cookie'
import refreshJWT from './refreshJWT'

export async function handle({ request, render }) {
  const response = await render(request);
  const cookies = cookie.parse(`${request.headers.cookie}`)

  if (!cookies?.jwt) {
    if (cookies.refresh) {
      const val = await refreshJWT(cookies.refresh)

      return {
        ...response,
        status: val.status,
        headers: {
          ...response.headers,
          ...val.headers,
        },
        body: {
          ...response.body,
          ...val.body,
        },
        authenticated: val.authenticated,
      }
    }
  }

  console.log(request);

  return {
    ...response,
    authenticated: true,
  }
}