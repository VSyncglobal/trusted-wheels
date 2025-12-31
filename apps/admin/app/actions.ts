'use server'

import { signOut } from "../auth"

export async function handleSignOut() {
  // strict: true guarantees the session is cleared
  // redirectTo tells it where to go after
  await signOut({ redirectTo: "/login", redirect: true })
}