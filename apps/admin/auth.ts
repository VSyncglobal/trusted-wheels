import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // --- DEBUG LOGS (Check your terminal when clicking login) ---
        console.log("Login Attempt:", credentials)
        console.log("Expected Email:", process.env.ADMIN_EMAIL)
        console.log("Expected Pass:", process.env.ADMIN_PASSWORD)
        // ------------------------------------------------------------

        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "1", name: "Admin", email: credentials.email as string }
        }
        
        // Returning null causes the "CredentialsSignin" error
        return null
      },
    }),
  ],
})