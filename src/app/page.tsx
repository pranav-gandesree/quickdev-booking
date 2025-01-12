
'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()


  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <button
        onClick={() =>  signIn("google", {callbackUrl: 'http://localhost:3000/onboarding'}) }
        className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg hover:border-slate-400 hover:shadow transition duration-150"
      >
        <img 
          className="w-6 h-6" 
          src="https://www.svgrepo.com/show/475656/google-color.svg" 
          loading="lazy" 
          alt="google logo"
        />
        <span>Sign in with Google</span>
      </button>
    </main>
  )
}
