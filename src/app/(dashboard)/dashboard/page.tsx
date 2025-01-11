
'use client'

import DeveloperDashboard from "@/components/canvas/DeveloperDashboard";
import UserDashboard from "@/components/canvas/UserDashboard";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

 const DashboardPage = () => {
  const { data: session } = useSession();

  if (!session?.user?.email) {
    redirect("/");
  }
  
  if (session?.user.role === "DEVELOPER") {
    return <DeveloperDashboard/>;
  } else {
    return <UserDashboard/>;
  }

};


export default DashboardPage;