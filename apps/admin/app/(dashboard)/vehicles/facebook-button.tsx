'use client'

import { useTransition } from "react"
import { Facebook, Loader2 } from "lucide-react"
import { publishToFacebook } from "./[id]/actions"

export function FacebookButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    const confirmed = window.confirm("Are you sure you want to publish this vehicle to Facebook?")
    if (!confirmed) return

    startTransition(async () => {
      const result = await publishToFacebook(id)
      alert(result.message)
    })
  }

  return (
    <button 
      onClick={handleClick}
      disabled={isPending}
      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <Facebook size={14} />}
      {isPending ? "Posting..." : "Post FB"}
    </button>
  )
}