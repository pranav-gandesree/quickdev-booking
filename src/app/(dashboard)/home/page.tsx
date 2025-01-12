'use client'

import DeveloperHome from "@/components/canvas/DeveloperHome";
import UserHome from "@/components/canvas/UserHome";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const HomePage = () => {
  const {data: session} = useSession();

  useEffect(()=>{
    console.log(session)
  },[session])
    
  if (session?.user.role === "DEVELOPER") {
    return <DeveloperHome/>;
  } else {
    return <UserHome/>;
  }
}

export default HomePage
