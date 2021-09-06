import authenticate from "./authenticate"

export function getSession({ locals }) {
  return locals
}

export async function handle({ request, resolve }) {
  const authentication = await authenticate({ headers: request.headers })
  request.locals.authenticated = authentication.authenticated

  const response = await resolve(request)

  response.headers = {
    ...response.headers,
    ...authentication.headers,
  }

  return response
}