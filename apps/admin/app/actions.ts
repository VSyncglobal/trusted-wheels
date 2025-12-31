'use server'

import { signOut } from "../auth"
import { redirect } from "next/navigation"

export async function handleSignOut() {
  // 1. Clear the session without throwing a redirect error
  await signOut({ redirect: false })
  
  // 2. Manually throw the Next.js redirect
  redirect("/login") 
}