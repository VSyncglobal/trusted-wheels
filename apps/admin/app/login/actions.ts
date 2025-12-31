'use server'
 
import { signIn } from "../../auth" // <--- CHANGED FROM ../../../auth to ../../auth
import { AuthError } from "next-auth"
 
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials. Please check your email and password.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}