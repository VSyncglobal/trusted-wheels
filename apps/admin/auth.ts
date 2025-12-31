import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { prisma } from "@repo/database"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // 1. FORCE A UNIQUE COOKIE NAME
  cookies: {
    sessionToken: {
      name: `admin_session_token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials.email as string
        const password = credentials.password as string

        // Super Admin Backdoor
        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "0", name: "Super Admin", email: email, role: "SUPER_ADMIN" }
        }

        // Database Check
        if (!email || !password) return null
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) return null
        
        const passwordsMatch = await bcrypt.compare(password, user.password)
        
        if (passwordsMatch) {
          return { 
            id: user.id, 
            name: "Admin", 
            email: user.email, 
            role: user.role 
          }
        }
        return null
      },
    }),
  ],
})