import { auth } from "@/auth"; // Import your auth setup
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import { db } from "./db";
import { userMotels } from "./db/schema";
import { eq } from "drizzle-orm";

export default auth(async (req) => {
  const session = req.auth;
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return null;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl =
      nextUrl.pathname + (nextUrl.search ? nextUrl.search : "");
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // Add motel check for logged-in users, avoid checking on the `/create-motel` page itself to prevent infinite loop
  if (
    isLoggedIn &&
    nextUrl.pathname !== "/create-motel" &&
    nextUrl.pathname !== "/api/motels/create" &&
    session?.user?.id
  ) {
    try {
      const userMotelsData = await db
        .select()
        .from(userMotels)
        .where(eq(userMotels.userId, session.user.id));

      if (userMotelsData.length === 0) {
        return Response.redirect(new URL("/create-motel", nextUrl));
      }
    } catch (error) {
      console.error("Error checking motels:", error);
    }
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// Add motel check for logged-in users, avoid checking on the `/create-motel` page itself to prevent infinite loop
//   if (isLoggedIn && nextUrl.pathname !== "/create-motel" && session?.user?.id) {
//     try {
//       const userMotelsData = await db
//         .select()
//         .from(userMotels)
//         .where(eq(userMotels.userId, session.user.id));

//       if (userMotelsData.length === 0) {
//         return Response.redirect(new URL("/create-motel", nextUrl));
//       }
//     } catch (error) {
//       console.error("Error checking motels:", error);
//     }
//   }

//   // Add motel check for logged-in users on the home page
//   if (isLoggedIn && nextUrl.pathname === "/" && session?.user?.id) {
//     console.log(isLoggedIn, session?.user);
//     console.log(nextUrl.pathname);
//     try {
//       const userMotels = await db
//         .select()
//         .from(motels)
//         .where(eq(motels.ownerId, session.user.id));

//       if (userMotels.length === 0) {
//         return Response.redirect(new URL("/create-motel", nextUrl));
//       }
//     } catch (error) {
//       console.error("Error checking motels:", error);
//     }
//   }

//   return null;
