import cookie from 'cookie'
import Database from '$lib/database/arangodb/index'

// export async function getContext({ headers, request }) {
//   const context = {
//     user: null,
//   };

//   // try {
//   //   const DB = await Database.getInstance(request.body.username, request.body.password)
//   //   await DB.createCollections()
//   //   const sessionToken = await DB.getDatabase().login(request.body.username, request.body.password)

//   //   if (!sessionToken) throw new Error('no session token received')

//   //   console.log(JSON.stringify(sessionToken));

//   //   // return response
//   // } catch (error) {
//   //   console.error('login.ts:post', error)
//   // }

//   // const cookies = cookie.parse(headers.cookie || "");
//   // const user = await auth.verifyAccessTokenCookie(cookies);
//   // if (user) {
//   //   context.user = user;
//   // }
//   // context.haveRefreshToken = cookies.refreshtoken ? true : false;

//   return context;
// }

// export function getSession({ context }) {
//   return {
//     user: context.user,
//   };
// }

// export async function handle({ request, render, response }) {
//   // const { context } = request;

//   // silent refresh
//   // if (!context.user && context.haveRefreshToken && request.path !== '/auth/refresh') {
//   //   return auth.redirectToRefresh(request);
//   // }

//   return render(request);
// }
