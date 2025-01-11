'use client'

import { FC, ReactNode, useState } from "react"
import { Button } from "../ui/button"
import { signIn } from "next-auth/react"

interface GoogleSignInButtonProps{
    children: ReactNode
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({children}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);


    const loginWithGoogle = async () =>{
      try {
        setIsLoading(true)
        signIn("google", {callbackUrl: 'http://localhost:3000'})
      } catch (error) {
        setIsLoading(false)
      }finally{
        setIsLoading(false)
      }
    } 
  return (
    <Button disabled={isLoading} className="" onClick={loginWithGoogle}>

      {children}
    </Button>
  )
}

export default GoogleSignInButton
