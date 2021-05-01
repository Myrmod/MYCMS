import * as cookie from 'cookie'

export async function get({ headers }) {
  const cookies = cookie.parse(`${headers.cookie}`)

  console.log('cookies:', cookies)

  return {
    status: 200,
    headers: {
      'set-cookie': [
        cookie.serialize('jwt', 'deleted', {
          httpOnly: true,
          expires: new Date(0),
          sameSite: 'strict',
          path: '/',
        }),
        cookie.serialize('refresh', 'deleted', {
          httpOnly: true,
          expires: new Date(0),
          sameSite: 'strict',
          path: '/',
        }),
      ],
    },
    body: {
      message: 'user logged in',
    },
  }
}
