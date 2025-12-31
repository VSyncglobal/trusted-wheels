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
      
      // FIX: Use 'startsWith' to handle query params (e.g., /login?error=...)
      const isOnLoginPage = nextUrl.pathname.startsWith("/login")

      if (isOnLoginPage) {
        // If logged in and on login page, redirect to dashboard
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl))
        
        // If not logged in, allow access to login page
        return true
      }

      // For all other routes (Dashboard), require login
      return isLoggedIn
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