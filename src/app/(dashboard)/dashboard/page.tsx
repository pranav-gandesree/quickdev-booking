
'use client'

import DeveloperDashboard from "@/components/canvas/DeveloperDashboard";
import UserDashboard from "@/components/canvas/UserDashboard";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

 const DashboardPage = () => {
  const { data: session } = useSession();

  useEffect(()=>{
    console.log("session in dashboard is ", session)
  }, [session])
  
  if (session?.user.role === "DEVELOPER") {
    return <DeveloperDashboard/>;
  } else {
    return <UserDashboard/>;
  }

};


export default DashboardPage;