'use client'

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react"


export default function Home() {

  const loginWithGoogle = async () =>{
    try {
      signIn("google", {callbackUrl: 'http://localhost:3000/home'})
    } catch (error) {
      console.log("error", error)
    }
  } 

  return (
    <div className="m-10">
    <div className="text-white">
      quick dev bookinggg
    </div>
      <Button  onClick={loginWithGoogle}>
        sign inn 
      </Button>

    </div>
  );
}
