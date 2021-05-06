import authenticate from "./authenticate"

export function getSession({ locals }) {
  return locals
}

export async function handle({ request, render }) {
  const authentication = await authenticate({ headers: request.headers })
  request.locals.authenticated = authentication.authenticated

  const result = await render(request)

  result.headers = {
    ...result.headers,
    ...authentication.headers,
  }

  return result
}