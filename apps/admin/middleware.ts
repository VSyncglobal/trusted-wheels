import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// 1. Initialize NextAuth with ONLY the lightweight config (No Prisma/Bcrypt)
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  // 2. Protect all routes except static assets and login
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
}