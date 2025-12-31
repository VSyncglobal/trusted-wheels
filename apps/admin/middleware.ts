import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  // REMOVED "|login" from the exclusion list below.
  // We WANT middleware to run on login so it can redirect logged-in users.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}