import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { 
    strategy: "jwt" 
  },
  // This ensures the Middleware looks for 'admin_session_token'
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
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname !== "/login"

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl))
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // @ts-ignore
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        // @ts-ignore
        session.user.role = token.role as string
      }
      return session
    }
  },
  providers: [], 
} satisfies NextAuthConfig