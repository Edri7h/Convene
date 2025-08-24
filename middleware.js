// import { clerkMiddleware } from '@clerk/nextjs/server';

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };


import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the routes that should be protected.
// A user must be signed in to visit these routes.
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/Meetings(.*)',
  '/Availability(.*)',
  '/Events(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // Check if the route is a protected route.
  if (isProtectedRoute(req)) {
    // If it is, protect it. This will automatically redirect
    // unauthenticated users to your sign-in page.
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};



