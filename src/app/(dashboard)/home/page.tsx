'use client'

import DeveloperHome from "@/components/canvas/DeveloperHome";
import UserHome from "@/components/canvas/UserHome";
import { useSession } from "next-auth/react";

const HomePage = () => {
  const {data: session} = useSession();
    
  if (session?.user.role === "DEVELOPER") {
    return <DeveloperHome/>;
  } else {
    return <UserHome/>;
  }
}

export default HomePage
